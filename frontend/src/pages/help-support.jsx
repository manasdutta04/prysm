import React from "react";
import FAQQuestions from "./components2/faq-questions.jsx";
import PersonalSpace from "./components2/personal-space.jsx";
import "./help-support.css";

export default function HelpSupportPage() {
  return (
    <div className="help-support-page">
      <div className="page-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">
          Find quick answers to common questions or contact our support team
          below.
        </p>
      </div>

      <FAQQuestions />
      <PersonalSpace />
    </div>
  );
}
