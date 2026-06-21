import React from "react";

export default function ConnectGmailButton() {
  const handleConnect = () => {
    const apiBase =
      (import.meta.env.VITE_API_URL ||
        "https://prysm-backend-8a87.onrender.com/api")
        .replace(/\/$/, "")
        .trim();

    window.location.href = `${apiBase}/auth/google/connect`;
  };

  return (
    <button
      onClick={handleConnect}
      style={{
        backgroundColor: "Green",
        padding: "5px",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      Connect Gmail
    </button>
  );
}
