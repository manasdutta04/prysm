import React, { useState } from "react";
import FAQQuestions from "./components2/faq-questions.jsx";
import PersonalSpace from "./components2/personal-space.jsx";
import { Search } from "lucide-react";
import "./help-support.css";

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="help-support-page">
      <div className="page-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">
          Find quick answers to common questions or submit a ticket to our support team.
        </p>
      </div>

      <div className="help-support-content-layout">
        <div className="faq-section-wrapper">
          <div className="faq-search-bar">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FAQQuestions searchQuery={searchQuery} />
        </div>
        
        <div className="support-form-wrapper">
          <PersonalSpace />
        </div>
      </div>
    </div>
  );
}
