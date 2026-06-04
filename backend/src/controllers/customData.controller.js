import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import Feedback from "../models/raw feedbacks/feedback.model.js";

export const uploadCustomData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const records = [];

    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({ columns: true, skip_empty_lines: true, trim: true }),
      );

    for await (const record of parser) {
      // Normalize column names (case-insensitive)
      const cols = {};
      for (const k of Object.keys(record)) {
        cols[k.trim().toLowerCase()] = record[k];
      }

      const source = cols.source || cols.platform || "custom";
      const content = cols.comment || cols.feedback || cols.content || "";
      const dateStr = cols.date || cols.timestamp || cols.time || "";

      const timestamp = dateStr ? new Date(dateStr) : new Date();
      const externalId = `custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

      records.push({ source, content, timestamp, externalId });
    }

    // Save to DB (associate with req.user if available)
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - must be logged in" });
    }

    const created = [];
    for (const r of records) {
      const fb = new Feedback({
        userId,
        source: r.source,
        externalId: r.externalId,
        content: r.content,
        timestamp: r.timestamp,
        metadata: { imported: true },
      });
      await fb.save();
      created.push(fb);
    }

    // remove uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // ignore
    }

    res.status(201).json({ message: `Imported ${created.length} records`, createdCount: created.length });
  } catch (error) {
    console.error("Error in uploadCustomData:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUploadHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - must be logged in" });
    }

    // return most recent 200 feedbacks for user
    const items = await Feedback.find({ userId })
      .sort({ timestamp: -1 })
      .limit(200)
      .select("source content timestamp metadata externalId -_id");

    res.status(200).json({ count: items.length, items });
  } catch (error) {
    console.error("Error in getUploadHistory:", error.message);
    res.status(500).json({ message: error.message });
  }
};
