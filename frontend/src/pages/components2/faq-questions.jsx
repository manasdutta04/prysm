import React, { useState } from "react";
import faqs from "./questions";
import "../help-support.css";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQQuestions({ searchQuery = "" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faq-container">
      <h2 className="section-title">Frequently Asked Questions</h2>
      
      {filteredFaqs.length > 0 ? (
        <div className="faq-list">
          {filteredFaqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "active" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <div className="faq-question-text-group">
                    <HelpCircle className="faq-question-icon" size={18} />
                    <span>{faq.question}</span>
                  </div>
                  <span className="faq-icon-wrapper">
                    <ChevronDown
                      className={`faq-chevron ${isOpen ? "rotated" : ""}`}
                      size={18}
                    />
                  </span>
                </div>
                <div
                  className="faq-answer-wrapper"
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="faq-empty-state">
          <p>No answers found for "{searchQuery}". Try searching for other terms or submit a query below.</p>
        </div>
      )}
    </div>
  );
}
