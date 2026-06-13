import React, { useCallback, useState } from "react";
import "./custom-data.css";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, Check, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";

const parseCSVPreview = (text) => {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      lines.push(row);
      row = [];
      currentVal = "";
      if (lines.length >= 6) { // Header + 5 rows
        break;
      }
    } else {
      currentVal += char;
    }
  }
  if (row.length > 0 || currentVal) {
    row.push(currentVal.trim());
    lines.push(row);
  }
  return lines;
};

export default function CustomDataPage() {
  const [fileName, setFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useNotificationStore();

  const onFile = useCallback((file) => {
    if (!file) return;

    // Client-side validation — only .csv allowed
    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file type: Please upload a .csv file.");
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    setStatus("");
    setPreviewRows([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseCSVPreview(text);
      setPreviewRows(parsed);
    };
    reader.readAsText(file);
  }, []);

  const handleImportData = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus("");

    const fd = new FormData();
    fd.append("file", selectedFile);

    try {
      const resp = await axios.post("/custom-data/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(resp.data.message || "Upload complete");
      toast.success(resp.data.message || "Upload complete");
      addNotification({
        title: "CSV Upload Completed",
        description: `Successfully imported "${selectedFile.name}" feedback records to MongoDB.`,
        category: "system"
      });
      // Clear preview
      setFileName(null);
      setSelectedFile(null);
      setPreviewRows([]);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Upload failed";
      setStatus(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearPreview = () => {
    setFileName(null);
    setSelectedFile(null);
    setPreviewRows([]);
    setStatus("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    onFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowse = (e) => {
    const f = e.target.files[0];
    onFile(f);
  };

  return (
    <div className="custom-data-page">
      <div className="content">
        {/* Upload Card */}
        <div
          className={`upload-area ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="upload-inner">
            <p className="upload-title">Upload your File:</p>
            
            {selectedFile ? (
              <div className="csv-preview-container">
                <p className="preview-heading">CSV Preview (First 5 Rows)</p>
                <div className="preview-table-wrapper">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {previewRows[0]?.map((header, idx) => (
                          <th key={idx}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.slice(1).map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="preview-actions">
                  <button
                    className="btn-clear"
                    onClick={handleClearPreview}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-import"
                    onClick={handleImportData}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="spin-icon mr-2" size={16} />
                        Importing...
                      </>
                    ) : (
                      "Import Data"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className={`drop-box ${isDragging ? "drag-active" : ""}`}>
                {isUploading ? (
                  <div className="uploading-state">
                    <Loader2 className="spin-icon" size={32} />
                    <p>Uploading...</p>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon-container">
                      <UploadCloud className="upload-cloud-icon" size={32} />
                    </div>
                    <p className="drop-text">Drag &amp; Drop</p>
                    <p>
                      or{" "}
                      <label className="browse-label">
                        browse
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleBrowse}
                          hidden
                        />
                      </label>
                    </p>
                    <p className="hint">upload in .csv format only</p>
                  </>
                )}
              </div>
            )}

            {fileName && (
              <div className="file-name">
                <FileSpreadsheet className="file-icon" size={16} />
                <span>{fileName}</span>
              </div>
            )}

            {status && !isUploading && (
              <div
                className={`status ${
                  status.toLowerCase().includes("fail") ||
                  status.toLowerCase().includes("error") ||
                  status.toLowerCase().includes("missing") ||
                  status.toLowerCase().includes("invalid")
                    ? "status-error"
                    : "status-success"
                }`}
              >
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="instructions">
          <div className="instructions-header">
            <span className="instructions-tag">CSV Schema</span>
            <h3>Data Format Guide</h3>
            <p className="instructions-subtitle">Follow these schema requirements to format your custom feedback CSV correctly.</p>
          </div>

          <div className="requirements-list">
            <div className="requirement-item">
              <div className="req-label-container">
                <span className="req-number">01</span>
                <code className="req-code">source</code>
                <span className="req-badge">Required</span>
              </div>
              <p className="req-text">Identifies the platform source of the feedback (e.g. appstore, playstore, twitter).</p>
            </div>

            <div className="requirement-item">
              <div className="req-label-container">
                <span className="req-number">02</span>
                <div className="req-code-group">
                  <code className="req-code">date</code>
                  <span className="req-or-divider">or</span>
                  <code className="req-code">timestamp</code>
                </div>
                <span className="req-badge">Required</span>
              </div>
              <p className="req-text">The timestamp of the review, formatted as ISO-8601 or YYYY-MM-DD.</p>
            </div>

            <div className="requirement-item">
              <div className="req-label-container">
                <span className="req-number">03</span>
                <div className="req-code-group">
                  <code className="req-code">feedback</code>
                  <span className="req-or-divider">or</span>
                  <code className="req-code">comment</code>
                </div>
                <span className="req-badge">Required</span>
              </div>
              <p className="req-text">The main text content containing the user's review or comments.</p>
            </div>
          </div>

          <div className="instructions-note">
            <div className="note-item">
              <Check className="note-icon" size={14} />
              <span>Only <strong>.csv</strong> files accepted</span>
            </div>
            <div className="note-item">
              <Check className="note-icon" size={14} />
              <span>Extra columns will be ignored</span>
            </div>
            <div className="note-item">
              <Check className="note-icon" size={14} />
              <span>Source is normalized automatically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}