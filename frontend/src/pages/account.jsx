import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock, Shield, Camera, Calendar, Award } from "lucide-react";
import toast from "react-hot-toast";
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
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">
          Manage your profile information, email preferences, and password security.
        </p>
      </div>

      <div className="account-layout">
        {/* Left Side: Profile overview card */}
        <div className="profile-overview-card">
          <div className="avatar-section">
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
            <h2 className="user-display-name">{authUser?.fullName}</h2>
            <span className="user-role-badge">Administrator</span>
          </div>

          <div className="divider-line" />

          <div className="profile-metadata-list">
            <div className="metadata-item">
              <Shield size={16} className="meta-icon" />
              <div className="meta-info">
                <span className="meta-label">System Role</span>
                <span className="meta-value">Owner / Admin</span>
              </div>
            </div>
            <div className="metadata-item">
              <Calendar size={16} className="meta-icon" />
              <div className="meta-info">
                <span className="meta-label">Member Since</span>
                <span className="meta-value">{memberSince}</span>
              </div>
            </div>
            <div className="metadata-item">
              <Award size={16} className="meta-icon" />
              <div className="meta-info">
                <span className="meta-label">Account Status</span>
                <span className="meta-value text-green">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Forms */}
        <div className="account-forms-container">
          {/* Profile Details Form */}
          <div className="account-form-card">
            <h2 className="form-card-title">Profile Details</h2>
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

          {/* Change Password Form */}
          <div className="account-form-card">
            <h2 className="form-card-title">Security & Password</h2>
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
      </div>
    </div>
  );
}
