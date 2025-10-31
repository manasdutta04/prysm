import React, { useRef } from "react";
import "./docs.css";
import documentationContent from "./components2/docContent.js";

export default function DocsPage() {
  const contentRef = useRef(null);

  // ✅ Smooth and accurate scroll to section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section && contentRef.current) {
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const offset =
        sectionTop - containerTop + contentRef.current.scrollTop - 20;

      contentRef.current.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="docs-page">
      <div className="page-title">Documentation</div>

      <div className="docs-container">
        {/* Sidebar index */}
        <div className="docs-index">
          <h3>Contents</h3>
          <ul>
            {documentationContent.map((section) => (
              <li key={section.id} onClick={() => scrollToSection(section.id)}>
                {section.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Scrollable content */}
        <div className="page-content scrollable" ref={contentRef}>
          {documentationContent.map((section) => (
            <div key={section.id} id={section.id} className="doc-section">
              <h2>{section.title}</h2>
              <div
                className="doc-section-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
