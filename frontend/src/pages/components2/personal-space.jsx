import React, { useState } from "react";
import "../help-support.css";
import { Send, RotateCcw } from "lucide-react";

export default function PersonalSpace() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  // Only letters allowed for name fields
  const nameRegex = /^[A-Za-z]*$/; // allows empty string too for smooth typing

  // Allow only letters, digits, "@", ".", "_" for email (no spaces or others)
  const allowedEmailChars = /^[A-Za-z0-9@._]*$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name validation
    if (["firstName", "middleName", "lastName"].includes(name)) {
      if (nameRegex.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Email validation (allows partial typing but blocks invalid chars)
    if (name === "email") {
      if (allowedEmailChars.test(value)) {
        setFormData((prev) => ({ ...prev, email: value }));
      }
      return;
    }

    // Other fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final check: email must include '@' and '.'
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Your query submitted successfully");
    handleClear();
  };

  return (
    <div className="query-form-card">
      <h2 className="section-title">Submit a Support Ticket</h2>
      <form onSubmit={handleSubmit} className="support-form">
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name</label>
            <input
              type="text"
              name="middleName"
              placeholder="optional"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="text" // use text instead of email for custom validation
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={!formData.category ? "select-placeholder" : ""}
            >
              <option value="" hidden disabled>
                Select a category
              </option>
              <option value="billing">Billing & Subscriptions</option>
              <option value="technical">Technical Issue</option>
              <option value="account">Account Management</option>
              <option value="feedback">General Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Subject *</label>
          <input
            type="text"
            name="subject"
            placeholder="Brief summary of your query"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea
            rows="5"
            name="message"
            placeholder="Please detail your question or issue here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <Send size={16} />
            <span>Submit Ticket</span>
          </button>
          <button type="button" className="clear-btn" onClick={handleClear}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
}
