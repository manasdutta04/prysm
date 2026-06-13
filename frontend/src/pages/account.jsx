import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock, Shield, Camera } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import "./account.css";

export default function AccountPage() {
  const { authUser, updateProfile } = useAuthStore();
  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName || !profileData.email) {
      toast.error("Please fill in all profile fields");
      return;
    }

    setIsUpdatingProfile(true);
    await updateProfile({
      fullName: profileData.fullName,
      email: profileData.email,
    });
    setIsUpdatingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    const success = await updateProfile({
      password: passwordData.newPassword,
    });
    setIsUpdatingPassword(false);
    if (success) {
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
  };

  const handleConfirmClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      const res = await axiosInstance.post("/auth/clear-history");
      toast.success(
        `Successfully cleared history! Deleted ${res.data.feedbacksDeleted} feedbacks and ${res.data.reportsDeleted} reports.`
      );
      setShowConfirmModal(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Clear History Error:", error);
      toast.error(error.response?.data?.message || "Failed to clear history");
    } finally {
      setIsClearingHistory(false);
    }
  };

  const initials = authUser?.fullName
    ? authUser.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="account-page">
      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="account-confirm-modal-overlay">
          <div className="account-confirm-modal liquid-glass-card">
            <h3 className="confirm-modal-title">Clear Account History?</h3>
            <p className="confirm-modal-desc">
              Are you sure you want to delete all feedback data, scraped reviews, custom CSV uploads, and generated reports? This action is permanent and cannot be undone.
            </p>
            <div className="confirm-modal-actions">
              <button
                className="btn btn-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={isClearingHistory}
              >
                Cancel
              </button>
              <button
                className="btn btn-confirm-delete"
                onClick={handleConfirmClearHistory}
                disabled={isClearingHistory}
              >
                {isClearingHistory ? "Clearing..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="account-layout">
        {/* Profile Details Panel */}
        <div className="settings-panel liquid-glass-card">
          <div className="panel-header">
            <User className="panel-icon" size={20} />
            <div>
              <h2 className="panel-title">Profile Details</h2>
              <p className="panel-desc">Manage your public profile information and email address.</p>
            </div>
          </div>

          <div className="panel-body">
            {/* Integrated Avatar & Basic Info */}
            <div className="avatar-upload-container">
              <div className="large-avatar-glow">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.fullName}
                    className="profile-avatar-img"
                  />
                ) : (
                  <div className="profile-avatar-initials">{initials}</div>
                )}
                <button
                  className="avatar-edit-overlay"
                  onClick={() => toast.success("Avatar upload simulation triggered")}
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className="avatar-upload-info">
                <h3 className="avatar-user-name">{authUser?.fullName}</h3>
                <p className="avatar-user-status">Verified Account • Member since {memberSince}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="glass-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={16} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn btn-primary"
              >
                {isUpdatingProfile ? "Saving changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Panel */}
        <div className="settings-panel liquid-glass-card">
          <div className="panel-header">
            <Lock className="panel-icon" size={20} />
            <div>
              <h2 className="panel-title">Security & Password</h2>
              <p className="panel-desc">Update your password to keep your account secure.</p>
            </div>
          </div>

          <div className="panel-body">
            <form onSubmit={handlePasswordSubmit} className="glass-form">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={16} />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Minimum 6 characters"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={16} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="btn btn-primary"
              >
                {isUpdatingPassword ? "Updating password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Clear History Danger Zone Panel */}
        <div className="settings-panel liquid-glass-card danger-zone-panel">
          <div className="panel-header">
            <Shield className="panel-icon danger-icon" size={20} />
            <div>
              <h2 className="panel-title danger-title">Danger Zone</h2>
              <p className="panel-desc">Irreversible account actions and history cleanup.</p>
            </div>
          </div>

          <div className="panel-body danger-zone-content">
            <p className="danger-zone-desc">
              Permanently delete all ingested reviews, custom CSV uploads, and generated AI analysis history associated with your account. This action is irreversible.
            </p>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-danger"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
