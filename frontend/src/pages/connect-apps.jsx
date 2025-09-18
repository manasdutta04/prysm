import React from "react";
import "./connect-apps.css";

export default function ConnectAppsPage() {
  const apps = [
    {
      name: "Gmail",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      description: "Connect your Gmail account"
    },
    {
      name: "X",
      logo: "https://static.vecteezy.com/system/resources/previews/027/714/631/non_2x/sankt-petersburg-russia-24-08-2023-twitter-new-logo-twitter-icons-twitter-x-logo-free-png.png",
      description: "Connect your X account"
    },
    {
      name: "Play Store",
      logo: "https://cdn.freebiesupply.com/logos/large/2x/google-play-store-logo-png-transparent.png",
      description: "Connect your Google Play Store"
    },
    {
      name: "App Store",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg",
      description: "Connect your Apple App Store"
    }
  ];

  const handleConnect = (appName) => {
    console.log(`Connecting to ${appName}...`);
    // Add connection logic here
  };

  return (
    <div className="connect-apps-page">
      <div className="page-header">
        <h1 className="page-title">Connect Apps</h1>
        <p className="page-subtitle">Connect your apps to sync data seamlessly</p>
      </div>
      <div className="connect-apps-grid">
        {apps.map((app, index) => (
          <div key={index} className="app-card">
            <div className="app-logo">
              <img src={app.logo} alt={`${app.name} logo`} />
            </div>
            <div className="app-info">
              <h3 className="app-name">{app.name}</h3>
              <p className="app-description">{app.description}</p>
            </div>
            <button 
              className="connect-button"
              onClick={() => handleConnect(app.name)}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
