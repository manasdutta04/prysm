import React, { useState } from "react";
import "../help-support.css";
import { MdOutlineClear } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";

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
    <div className="query-form">
      <h2>Have other queries? Tell us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            value={formData.middleName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text" // use text instead of email for custom validation
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={!formData.category ? "placeholder" : ""}
          >
            <option value="" hidden disabled>
              --Select a Category--
            </option>
            <option value="billing">Billing</option>
            <option value="technical">Technical Issue</option>
            <option value="account">Account Management</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          rows="5"
          name="message"
          placeholder="Describe your issue..."
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <div className="form-buttons">
          <button type="submit">
            <IoMdDoneAll />
          </button>
          <button type="button" className="clear-btn red" onClick={handleClear}>
            <MdOutlineClear />
          </button>
        </div>
      </form>
    </div>
  );
}
