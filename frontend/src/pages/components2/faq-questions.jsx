import React, { useState } from "react";
import faqs from "./questions";
import "../help-support.css";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";

export default function FAQQuestions() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? "active" : ""}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">
            {faq.question}
            <span className="faq-icon">
              {activeIndex === index ? <FaAngleUp /> : <FaAngleDown />}
            </span>
          </div>
          <div
            className="faq-answer"
            style={{
              maxHeight: activeIndex === index ? "500px" : "0px",
            }}
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
