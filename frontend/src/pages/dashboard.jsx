import React from "react";
import "./dashboard.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
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
