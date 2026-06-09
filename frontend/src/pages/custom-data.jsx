import React, { useCallback, useState } from "react";
import "./custom-data.css";
import axios from "../lib/axios";

export default function CustomDataPage() {
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState("");

  const onFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStatus("Uploading...");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const resp = await axios.post("/custom-data/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(resp.data.message || "Upload complete");
    } catch (err) {
      setStatus(err?.response?.data?.message || err.message || "Upload failed");
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    onFile(f);
  };

  const handleBrowse = (e) => {
    const f = e.target.files[0];
    onFile(f);
  };

  return (
    <div className="custom-data-page grid">
      <h2 className="page-title">Custom Data</h2>
      <div className="content">
        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="upload-inner">
            <p className="upload-title">Upload your File :</p>
            <div className="drop-box">
              <p>Drag & Drop</p>
              <p>or <label className="browse-label">browse
                <input type="file" accept=".csv" onChange={handleBrowse} hidden />
              </label></p>
              <p className="hint">upload in .csv format</p>
            </div>
            {fileName && <div className="file-name">{fileName}</div>}
            {status && <div className="status">{status}</div>}
          </div>
        </div>

        <div className="instructions">
          <h3>Instructions</h3>
          <ol>
            <li>Must carry column <strong>source</strong></li>
            <li>Must carry column <strong>date</strong></li>
            <li>Must carry column <strong>comment</strong> / <strong>feedback</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
