import React from "react";
import "./dashboard.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import ConnectGmailButton from "../components/ConnectGmailButton";
import FetchEmailsButton from "../components/FetchEmailsButton";

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
        {/* <div>
          <h1>Gmail Integration Test</h1>
          <ConnectGmailButton />
          <FetchEmailsButton />
        </div> */}
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
