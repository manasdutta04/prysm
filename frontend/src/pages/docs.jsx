import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import "./docs.css";
import documentationContent from "./components2/docContent.js";
import { Search, FileText, ArrowRight } from "lucide-react";

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

  const renderLinkedText = (text) => {
    if (!/\/[a-z-]+|https:\/\/[^\s]+/.test(text)) return text;

    return text.split(/(\/[a-z-]+|https:\/\/[^\s]+)/g).map((part, idx) => {
      if (/^\/[a-z-]+$/.test(part)) {
        return (
          <Link key={idx} to={part} className="doc-inline-link">
            {part}
          </Link>
        );
      }
      if (part.startsWith("https://")) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-inline-link"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

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
                <p className="callout-text">{renderLinkedText(exampleText)}</p>
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
                      <span className="spec-value">{renderLinkedText(val)}</span>
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
                        <span className="list-text-val">{renderLinkedText(restPart)}</span>
                      </li>
                    );
                  }

                  return <li key={lIdx}>{renderLinkedText(trimmedLine)}</li>;
                })}
              </ul>
            );
          }

          // Standard paragraph block
          return <p key={index}>{renderLinkedText(text)}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="docs-page">
      {/* Header/Navbar matching landing page style */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 max-w-[1440px] mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src="/prysm-logo.png"
            alt="Prysm Logo"
            className="h-10 w-auto object-contain"
          />
          <span
            className="font-normal text-white tracking-tight text-3xl italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Prysm
          </span>
        </Link>
        <Link to="/login">
          <LiquidButton size="sm" className="text-white font-bold tracking-wide">
            Open App
          </LiquidButton>
        </Link>
      </header>

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

          <div className="docs-index-title">User Guide</div>
          
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
          <div className="docs-intro-banner liquid-glass-card">
            <div>
              <p className="docs-intro-label">Deployed on Vercel</p>
              <h1 className="docs-intro-title">How to use Prysm</h1>
              <p className="docs-intro-desc">
                Step-by-step guide for the live web app — connect sources, add your AI key, and run feedback analysis from the dashboard.
              </p>
            </div>
            <Link to="/login" className="docs-intro-cta">
              Get started <ArrowRight size={16} />
            </Link>
          </div>

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

        </div>

      </div>
    </div>
  );
}
