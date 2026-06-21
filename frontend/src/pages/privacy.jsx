import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import privacyContent from "./components2/privacy-content";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#0A0A0A] text-white px-4 py-28 overflow-hidden w-full font-sans">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#CCFF00]/5 rounded-full blur-[150px] opacity-30 pointer-events-none" />

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
        <Link to="/">
          <LiquidButton size="sm" className="text-white font-bold tracking-wide">
            Back to Home
          </LiquidButton>
        </Link>
      </header>

      {/* Privacy Content Container */}
      <div className="z-10 w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col gap-8" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl italic font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Last updated: June 14, 2026 // Data Governance
          </p>
        </div>

        <hr className="border-white/10" />

        <div className="space-y-8">
          {privacyContent.map((section) => (
            <section key={section.id} className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2" style={{ fontFamily: "'Geist', sans-serif" }}>
                <span className="text-[#CCFF00] font-mono text-sm">//</span> {section.title}
              </h2>

              {section.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm text-zinc-400 leading-relaxed font-sans"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="list-disc pl-6 text-sm text-zinc-400 space-y-2 font-sans">
                  {section.list.map((item, index) => (
                    <li key={index} className="marker:text-[#CCFF00]">{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <hr className="border-white/10" />

        <div className="flex justify-center mt-4">
          <Link to="/">
            <LiquidButton size="lg" className="text-white font-bold tracking-wide">
              I Understand &amp; Return Home
            </LiquidButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
