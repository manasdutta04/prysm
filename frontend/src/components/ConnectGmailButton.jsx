import React from "react";

export default function ConnectGmailButton() {
  const handleConnect = () => {
    window.location.href = "http://localhost:5000/api/auth/google/connect";
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
