import React, { useCallback, useState } from "react";
import "./custom-data.css";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function CustomDataPage() {
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onFile = useCallback(async (file) => {
    if (!file) return;

    // Client-side validation — only .csv allowed
    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file type: Please upload a .csv file.");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setStatus("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const resp = await axios.post("/custom-data/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(resp.data.message || "Upload complete");
      toast.success(resp.data.message || "Upload complete");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Upload failed";
      setStatus(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  }, []);

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
    <div className="custom-data-page grid">
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
            <div className={`drop-box ${isDragging ? "drag-active" : ""}`}>
              {isUploading ? (
                <div className="uploading-state">
                  <Loader2 className="spin-icon" size={32} />
                  <p>Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="upload-icon">📂</div>
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

            {fileName && !isUploading && (
              <div className="file-name">📄 {fileName}</div>
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
          <h3>Instructions</h3>
          <ol>
            <li>
              Must carry column <strong>source</strong>
            </li>
            <li>
              Must carry column <strong>date</strong> or{" "}
              <strong>timestamp</strong>
            </li>
            <li>
              Must carry column <strong>feedback</strong> or{" "}
              <strong>comment</strong>
            </li>
          </ol>
          <div className="instructions-note">
            <p>✅ Only <strong>.csv</strong> files accepted</p>
            <p>✅ Extra columns will be ignored</p>
            <p>✅ Source is normalized automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}