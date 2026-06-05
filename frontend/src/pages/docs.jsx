import React, { useRef, useState, useEffect } from "react";
import "./docs.css";
import documentationContent from "./components2/docContent.js";
import { Search, FileText, CheckCircle } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(documentationContent[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section && contentRef.current) {
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const offset =
        sectionTop - containerTop + contentRef.current.scrollTop - 10;

      contentRef.current.scrollTo({
        top: offset,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // Scroll spy via IntersectionObserver to auto-highlight active sidebar item
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const options = {
      root: container,
      rootMargin: "-10% 0px -70% 0px", // triggers when section enters the upper-middle region
      threshold: 0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    const sections = container.querySelectorAll(".doc-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [searchQuery]); // Re-bind observer if sections list changes due to search

  // Filter content based on search query
  const filteredContent = documentationContent.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Smart plain-text parser to render highly formatted HTML components
  const parseContent = (content) => {
    if (content.includes("<table")) {
      return (
        <div
          className="doc-section-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    const blocks = content.trim().split("\n\n");

    return (
      <div className="doc-section-content">
        {blocks.map((block, index) => {
          const text = block.trim();
          if (!text) return null;

          // Render examples as modern callout boxes
          if (text.startsWith("Example:")) {
            const exampleText = text.replace(/^Example:\s*/, "");
            return (
              <div key={index} className="doc-callout example-callout">
                <span className="callout-badge">EXAMPLE</span>
                <p className="callout-text">{exampleText}</p>
              </div>
            );
          }

          // Render numbered sub-headings cleanly
          if (/^\d+\.\d+\s+/.test(text)) {
            return (
              <h3 key={index} className="doc-subheading">
                {text}
              </h3>
            );
          }

          // Render specification labels (Hardware/Software requirements)
          if (
            text.toLowerCase() === "hardware requirements" ||
            text.toLowerCase() === "software requirements"
          ) {
            return (
              <h4 key={index} className="doc-requirement-title">
                {text}
              </h4>
            );
          }

          // Format key-value pairs (like specs) into custom layout cards
          const lines = text.split("\n");
          if (
            lines.length > 1 &&
            lines.every((line) => line.includes(":") && !line.includes("://"))
          ) {
            return (
              <div key={index} className="doc-spec-grid">
                {lines.map((line, lIdx) => {
                  const parts = line.split(":");
                  const label = parts[0]?.trim();
                  const val = parts.slice(1).join(":")?.trim();
                  return (
                    <div key={lIdx} className="doc-spec-card">
                      <span className="spec-label">{label}</span>
                      <span className="spec-value">{val}</span>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Render multi-line descriptive text as key-value list bullet points
          if (lines.length > 1) {
            return (
              <ul key={index} className="doc-list">
                {lines.map((line, lIdx) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;

                  if (trimmedLine.includes(":") && !trimmedLine.includes("://")) {
                    const parts = trimmedLine.split(":");
                    const boldPart = parts[0]?.trim();
                    const restPart = parts.slice(1).join(":")?.trim();
                    return (
                      <li key={lIdx}>
                        <strong className="list-bold-label">{boldPart}:</strong>{" "}
                        <span className="list-text-val">{restPart}</span>
                      </li>
                    );
                  }

                  return <li key={lIdx}>{trimmedLine}</li>;
                })}
              </ul>
            );
          }

          // Standard paragraph block
          return <p key={index}>{text}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="docs-page">
      <div className="docs-container">
        
        {/* Sidebar Navigation */}
        <div className="docs-index">
          <div className="docs-search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="docs-index-title">Documentation</div>
          
          <ul className="docs-index-list">
            {filteredContent.map((section) => (
              <li
                key={section.id}
                className={activeSection === section.id ? "active" : ""}
                onClick={() => scrollToSection(section.id)}
              >
                <FileText size={14} className="doc-sidebar-icon" />
                <span>{section.title.replace(/^\d+\.\s+/, "")}</span>
              </li>
            ))}
            {filteredContent.length === 0 && (
              <li className="no-results">No documentation matches your query.</li>
            )}
          </ul>
        </div>

        {/* Scrollable Document Content */}
        <div className="page-content scrollable" ref={contentRef}>
          {filteredContent.map((section) => (
            <div key={section.id} id={section.id} className="doc-section">
              <h2 className="doc-section-title">{section.title}</h2>
              {parseContent(section.content)}
            </div>
          ))}

          {filteredContent.length === 0 && (
            <div className="docs-empty-state">
              <h3>No Results Found</h3>
              <p>We couldn't find any documentation sections matching your search.</p>
            </div>
          )}

          {/* Footer voting widget */}
          <div className="docs-feedback-footer">
            <div className="feedback-content">
              <CheckCircle className="feedback-icon" size={18} />
              <span>Was this page helpful?</span>
            </div>
            <div className="feedback-buttons">
              <button
                className="feedback-btn yes"
                onClick={() => alert("Thank you for your feedback!")}
              >
                Yes
              </button>
              <button
                className="feedback-btn no"
                onClick={() => alert("Thank you for your feedback!")}
              >
                No
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
