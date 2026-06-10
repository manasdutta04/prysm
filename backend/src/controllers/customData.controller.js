import fs from "fs";
import { parse } from "csv-parse";
import Feedback from "../models/raw_feedbacks/feedback.model.js";

// Known platform sources — normalize to these
const KNOWN_SOURCES = ["twitter", "x", "gmail", "email", "appstore", "playstore"];

const normalizeSource = (raw) => {
  if (!raw) return "custom";
  const s = raw.trim().toLowerCase();
  if (KNOWN_SOURCES.includes(s)) return s === "twitter" ? "x" : s;
  return "custom";
};

/**
 * @route POST /api/custom-data/upload
 */
export const uploadCustomData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;

    // ── Schema Validation ──────────────────────────────────────────
    // Read headers first before processing rows
    const rawText = fs.readFileSync(filePath, "utf-8");
    const firstLine = rawText.split("\n")[0] || "";
    const headers = firstLine.split(",").map((h) => h.trim().toLowerCase());

    const hasFeedback =
      headers.includes("feedback") ||
      headers.includes("comment") ||
      headers.includes("content");
    const hasSource = headers.includes("source");
    const hasTimestamp =
      headers.includes("timestamp") ||
      headers.includes("timestamps") ||
      headers.includes("date");

    const missing = [];
    if (!hasFeedback) missing.push("feedback");
    if (!hasSource) missing.push("source");
    if (!hasTimestamp) missing.push("timestamp");

    if (missing.length > 0) {
      // Delete temp file
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      return res.status(400).json({
        message: `Validation failed: Missing required columns: ${missing.join(", ")}.`,
      });
    }

    // ── Parse & Clean ──────────────────────────────────────────────
    const records = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

    for await (const record of parser) {
      // Normalize column names to lowercase
      const cols = {};
      for (const k of Object.keys(record)) {
        cols[k.trim().toLowerCase()] = record[k];
      }

      // Only save these 3 columns — discard everything else
      const rawSource = cols.source || "";
      const content = cols.comment || cols.feedback || cols.content || "";
      const dateStr = cols.date || cols.timestamp || cols.timestamps || "";

      if (!content) continue; // skip empty rows

      const source = normalizeSource(rawSource);
      const timestamp = dateStr ? new Date(dateStr) : new Date();
      const externalId = `custom-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      records.push({ source, content, timestamp, externalId });
    }

    // ── Save to MongoDB ────────────────────────────────────────────
    const userId = req.user ? req.user._id : "000000000000000000000001";

    const created = [];
    for (const r of records) {
      const fb = new Feedback({
        userId,
        source: r.source,
        externalId: r.externalId,
        content: r.content,
        timestamp: r.timestamp,
        metadata: { imported: true, uploadedAt: new Date() },
      });
      await fb.save();
      created.push(fb);
    }

    // Delete temp file after processing
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

    res.status(201).json({
      message: `Successfully imported ${created.length} records`,
      createdCount: created.length,
    });
  } catch (error) {
    console.error("❌ Error in uploadCustomData:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/custom-data/history
 */
export const getUploadHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : "000000000000000000000001";

    const items = await Feedback.find({ userId, source: "custom" })
      .sort({ timestamp: -1 })
      .limit(200)
      .select("source content timestamp metadata externalId -_id");

    res.status(200).json({ count: items.length, items });
  } catch (error) {
    console.error("❌ Error in getUploadHistory:", error.message);
    res.status(500).json({ message: error.message });
  }
};