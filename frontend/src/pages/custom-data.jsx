import React, { useState, useRef } from "react";
import "./custom-data.css";

export default function CustomDataPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      alert("Please upload a .csv file");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a .csv file");
    }
  };

  return (
    <div className="custom-data-page">
      <h2 className="upload-title">Upload your File :</h2>
      <div className="upload-container">
        {/* Dropzone */}
        <div
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            hidden
          />
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            {file ? (
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <button
                  className="remove-file"
                  onClick={() => setFile(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="dropzone-text">
                  <span className="drag-text">Drag & Drop</span>
                  <br />
                  or <span className="browse-link" onClick={handleBrowseClick}>browse</span>
                </p>
                <p className="dropzone-hint">upload in .csv format</p>

                <div className="instructions-inline">
                  <h3 className="instructions-title">Instructions</h3>
                  <p className="instructions-subtitle">Must carries column</p>
                  <ol className="instructions-list" style={{padding:0}}>
                    <li>source</li>
                    <li>date</li>
                    <li>comment/feedback</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
