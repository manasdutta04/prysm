import React from "react";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-widgets">
        <div className="dashboard-widget" />
        <div className="dashboard-widget" />
        <div className="dashboard-widget" />
      </div>
      <div className="dashboard-content" />
    </div>
  );
}
