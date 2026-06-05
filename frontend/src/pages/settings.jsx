import React, { useState, useEffect } from "react";
import { Sliders, Bell, Cpu, RefreshCw, Layout, Database } from "lucide-react";
import toast from "react-hot-toast";
import "./settings.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    negativeThreshold: 25,
    minMentions: 15,
    slackAlerts: true,
    emailAlerts: false,
    inAppAlerts: true,
    realtimeUpdates: true,
    defaultTimeframe: "7d",
    glowEffects: true,
    autoScrapeAppStore: true,
    autoScrapeX: false,
    scrapeInterval: 60,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prysm_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("prysm_settings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">
          Configure real-time scraping thresholds, notification alert channels, and UI dashboard preferences.
        </p>
      </div>

      <div className="settings-grid">
        
        {/* Card 1: Alert Thresholds */}
        <div className="settings-card">
          <div className="card-header-with-icon">
            <Sliders className="header-icon blue" size={18} />
            <h2 className="card-title">Alerting Thresholds</h2>
          </div>
          <p className="card-desc">
            Define limits that trigger high-priority alerts for customer sentiment anomalies.
          </p>
          <div className="card-content">
            <div className="setting-control-group">
              <div className="control-label-row">
                <span className="control-name">Negative Sentiment Spike</span>
                <span className="control-badge">{settings.negativeThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={settings.negativeThreshold}
                onChange={(e) => handleChange("negativeThreshold", parseInt(e.target.value))}
                className="range-slider"
              />
              <span className="control-hint">Alert if negative feedback spikes past this percentage.</span>
            </div>

            <div className="setting-control-group">
              <div className="control-label-row">
                <span className="control-name">Minimum Mention Rate</span>
                <span className="control-badge">{settings.minMentions} / hr</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={settings.minMentions}
                onChange={(e) => handleChange("minMentions", parseInt(e.target.value))}
                className="range-slider"
              />
              <span className="control-hint">Minimum threshold of comments in a cluster before alerting.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Notification Channels */}
        <div className="settings-card">
          <div className="card-header-with-icon">
            <Bell className="header-icon purple" size={18} />
            <h2 className="card-title">Alert Channels</h2>
          </div>
          <p className="card-desc">
            Select where Prysm sends emerging issue notifications when thresholds are crossed.
          </p>
          <div className="card-content flex-rows">
            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">Slack Integrations</span>
                <span className="toggle-desc">Dispatch reports directly to #engineering-alerts.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.slackAlerts}
                onChange={(e) => handleChange("slackAlerts", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">Email Digests</span>
                <span className="toggle-desc">Send weekly aggregated sentiment statistics summaries.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">In-App Notifications</span>
                <span className="toggle-desc">Show notification banners directly inside the dashboard.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.inAppAlerts}
                onChange={(e) => handleChange("inAppAlerts", e.target.checked)}
                className="switch-checkbox"
              />
            </label>
          </div>
        </div>

        {/* Card 3: Dashboard Layout */}
        <div className="settings-card">
          <div className="card-header-with-icon">
            <Layout className="header-icon green" size={18} />
            <h2 className="card-title">Dashboard & UI</h2>
          </div>
          <p className="card-desc">
            Customize rendering properties and default filters of the dashboard layout.
          </p>
          <div className="card-content flex-rows">
            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">Real-Time Data Streams</span>
                <span className="toggle-desc">Push automatic visual widget updates using Socket.io.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.realtimeUpdates}
                onChange={(e) => handleChange("realtimeUpdates", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">Glassmorphic Glow Effects</span>
                <span className="toggle-desc">Enable premium glowing shadows on metrics cards.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.glowEffects}
                onChange={(e) => handleChange("glowEffects", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <div className="setting-control-group mt-1">
              <span className="control-name mb-05 block">Default Feedback Timeframe</span>
              <select
                value={settings.defaultTimeframe}
                onChange={(e) => handleChange("defaultTimeframe", e.target.value)}
                className="settings-select"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All-Time Data</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Scraper Configuration */}
        <div className="settings-card">
          <div className="card-header-with-icon">
            <Database className="header-icon orange" size={18} />
            <h2 className="card-title">Scraper Engines</h2>
          </div>
          <p className="card-desc">
            Control the background scraping loops for social platforms and store listings.
          </p>
          <div className="card-content flex-rows">
            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">App Store listing scraper</span>
                <span className="toggle-desc">Ingest iOS application user reviews continuously.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScrapeAppStore}
                onChange={(e) => handleChange("autoScrapeAppStore", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <label className="toggle-control-row">
              <div className="toggle-label-info">
                <span className="toggle-name">Nitter / Twitter Scraper</span>
                <span className="toggle-desc">Poll social mentions via public Nitter instance feeds.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScrapeX}
                onChange={(e) => handleChange("autoScrapeX", e.target.checked)}
                className="switch-checkbox"
              />
            </label>

            <div className="setting-control-group mt-1">
              <div className="control-label-row">
                <span className="control-name">Scraping Loop Interval</span>
                <span className="control-badge">{settings.scrapeInterval} min</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={settings.scrapeInterval}
                onChange={(e) => handleChange("scrapeInterval", parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="settings-footer-actions">
        <button className="btn-save-settings" onClick={handleSave}>
          <RefreshCw className="btn-icon" size={16} />
          <span>Apply and Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
