import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

/* ─── Hand-drawn SVG accents ─── */
const ArrowGreenLeft = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full stroke-current overflow-visible" style={{ color: "#CCFF00" }} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGreenRight = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full stroke-current overflow-visible" style={{ color: "#CCFF00" }} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

/* ─── Rotating "GET STARTED FREE" badge ─── */
const CircularBadge = () => (
  <div
    className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-xl rotate-12 hover:scale-105 transition-transform cursor-pointer"
    style={{ background: "#CCFF00", border: "3px solid rgba(0,0,0,0.05)" }}
  >
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path id="prysm-circle-path" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em" }} fill="black">
          <textPath href="#prysm-circle-path" startOffset="0%">
            OPEN PRYSM FREE • OPEN PRYSM FREE •{" "}
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-10 h-10 text-black stroke-current overflow-visible" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,80 Q 40,50 30,30 T 80,20" />
        <path d="M60,10 L80,20 L70,40" />
      </svg>
    </div>
  </div>
);

/* ─── Floating source card ─── */
function SourceCard({ title, sub, color, rotate, bottom, top, left, right, delay = 0 }) {
  const posStyle = {
    ...(bottom !== undefined ? { bottom } : {}),
    ...(top !== undefined ? { top } : {}),
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
  };

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute z-30 pointer-events-auto"
      style={posStyle}
    >
      <div
        className="w-44 md:w-56 backdrop-blur-md border border-white/30 rounded-[1.75rem] p-5 flex flex-col gap-2 shadow-2xl transition-transform duration-500 hover:rotate-0"
        style={{ background: "rgba(255,255,255,0.15)", transform: `rotate(${rotate}deg)` }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <p className="font-bold text-base text-white leading-tight">{title}</p>
        <p className="text-xs text-white/70 font-mono">{sub}</p>
        <div
          className="flex items-center justify-center h-6 px-3 rounded w-fit mt-1"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <span className="text-[9px] font-black tracking-widest uppercase" style={{ color }}>[LIVE]</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Bottom feature cards ─── */
const featureCards = [
  {
    label: "CONNECT YOUR SOURCES",
    sub: "Link Gmail, X, App Store, Play Store or drag a CSV.",
    pill: { text: "5 sources connected", color: "#0A0A0A" },
    pillBadge: { text: "READY", color: "#CCFF00" },
  },
  {
    label: "ADD YOUR LLM KEY",
    sub: "Gemini, OpenAI, Claude, Groq or local Ollama — your key, your costs.",
    pill: { text: "gemini-1.5-flash", color: "#0A0A0A" },
    pillBadge: { text: "BYOK", color: "#CCFF00" },
  },
  {
    label: "GET INSTANT INSIGHTS",
    sub: "Sentiment, key insights and improvement areas in seconds.",
    pill: null,
    badge: { text: "76% POSITIVE // SCORE 4.2/5.0", color: "#0A0A0A", bg: "#CCFF00" },
  },
];

/* ─────────────────────── MAIN LANDING PAGE ─────────────────────── */
export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-hidden w-full"
      style={{ background: "#0A0A0A", selection: "background: #CCFF00; color: black" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Subtle center glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)" }}
      />

      {/* ───── NAVBAR ───── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 max-w-[1440px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="font-black tracking-tight text-xs md:text-sm px-3 py-1.5 relative shadow-sm"
            style={{ background: "white", color: "black", borderRadius: "1rem 1rem 1rem 0.2rem" }}
          >
            PRYSM
          </div>
          <div
            className="font-black text-xs md:text-sm px-3 py-1.5 rounded-full shadow-sm"
            style={{ background: "#CCFF00", color: "black", border: "1.5px solid white" }}
          >
            AI
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-2">
          {["Features", "How It Works", "Sources", "FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => {
                const id = item.toLowerCase().replace(/ /g, "-");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 rounded-full border text-white text-xs font-semibold hover:bg-white/10 transition-colors bg-transparent cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA */}
        <Link to="/login">
          <button
            className="px-6 py-2 rounded-full border text-white text-xs md:text-sm font-semibold hover:bg-white hover:text-black transition-colors"
            style={{ borderColor: "white" }}
          >
            Log In
          </button>
        </Link>
      </nav>

      {/* ───── HERO ───── */}
      <main className="flex-1 relative z-10 pt-8 pb-32 md:pt-12 md:pb-48 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10 mt-4 mb-16">

          {/* Headline typography */}
          <div className="w-full flex flex-col items-center relative z-10" style={{ gap: "0.5rem" }}>
            {/* UNIFY */}
            <div className="w-full flex justify-start pl-[8%] md:pl-[20%] relative z-30">
              <h1
                className="font-black leading-[0.85] tracking-tighter m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  fontSize: "clamp(3.5rem,10vw,130px)",
                  color: "#CCFF00",
                  textShadow: [1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`${n}px ${n}px 0 #1a1a00`).join(", "),
                }}
              >
                UNIFY
              </h1>
            </div>

            {/* FEEDBACK */}
            <div className="w-full flex justify-center relative z-20">
              <h1
                className="font-black leading-[0.85] tracking-tighter m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  fontSize: "clamp(4rem,13vw,190px)",
                  color: "#F5F5F0",
                  textShadow: [1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`${n}px ${n}px 0 #1a1a1a`).join(", "),
                }}
              >
                FEEDBACK
              </h1>
            </div>

            {/* INSIGHTS */}
            <div className="w-full flex justify-end pr-[8%] md:pr-[18%] relative z-10">
              <h1
                className="font-black leading-[0.85] tracking-tighter m-0 p-0 uppercase"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  fontSize: "clamp(3.5rem,10vw,130px)",
                  color: "#F5F5F0",
                  textShadow: [1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`${n}px ${n}px 0 #1a1a1a`).join(", "),
                }}
              >
                INSIGHTS
              </h1>
            </div>
          </div>

          {/* Absolute overlays */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">

            {/* Floating source card — bottom left */}
            <SourceCard
              title="App Store Reviews"
              sub="1,284 feedbacks ingested"
              color="#CCFF00"
              rotate={-11}
              bottom="5%"
              left="2%"
              delay={0}
            />

            {/* Floating source card — top right */}
            <SourceCard
              title="X / Nitter Feed"
              sub="Sentiment: 76% positive"
              color="#60A5FA"
              rotate={12}
              top="10%"
              right="2%"
              delay={1.2}
            />

            {/* Arrow left */}
            <div className="absolute bottom-[0%] left-[0%] md:left-[8%] w-24 h-24 md:w-32 md:h-32 z-20">
              <ArrowGreenLeft />
            </div>

            {/* Arrow right */}
            <div className="absolute top-[5%] right-[0%] md:right-[8%] w-24 h-24 md:w-32 md:h-32 z-20">
              <ArrowGreenRight />
            </div>

            {/* Rotating badge — bottom right */}
            <div className="absolute bottom-[-8%] right-[0%] md:right-[12%] z-40 pointer-events-auto">
              <Link to="/login">
                <CircularBadge />
              </Link>
            </div>

          </div>
        </div>

        {/* Subheading + liquid CTA below headline block */}
        <div className="relative z-20 flex flex-col items-center gap-6 mt-4">
          <p
            className="text-center max-w-[600px] px-4"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(11px,1.4vw,14px)", color: "#888", letterSpacing: "1px", lineHeight: 1.7 }}
          >
            PRIVACY-FIRST AI FEEDBACK AGGREGATOR FOR PRODUCT TEAMS.<br />
            YOUR KEY. YOUR INSIGHTS. ZERO AI MARKUP.
          </p>
          <Link to="/login">
            <LiquidButton size="xl" className="text-white font-bold tracking-wide">
              Open Prysm Free
            </LiquidButton>
          </Link>
        </div>
      </main>

      {/* ───── BOTTOM FEATURE CARDS ───── */}
      <section
        className="text-black px-6 py-12 md:px-10 md:py-16 relative z-20 w-full mt-auto"
        style={{
          background: "white",
          borderRadius: "2.5rem 2.5rem 0 0",
          boxShadow: "0 -20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="rounded-[2rem] p-8 flex flex-col items-center text-center relative border"
              style={{ background: "#F8F9FA", borderColor: "#e5e7eb", minHeight: "16rem" }}
            >
              <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">{card.label}</h3>
              <p className="text-[10px] md:text-xs font-bold mb-auto" style={{ color: "rgba(0,0,0,0.6)" }}>{card.sub}</p>

              {/* Pill / badge graphic */}
              <div className="relative w-full flex justify-center mt-6">
                {card.pill && (
                  <>
                    <div
                      className="flex items-center rounded-2xl p-3 pr-20 text-white shadow-lg relative z-10"
                      style={{ background: card.pill.color }}
                    >
                      <div
                        className="w-7 h-7 rounded-full mr-3 flex-shrink-0 flex items-center justify-center font-black text-xs"
                        style={{ background: "#CCFF00", color: "black" }}
                      >
                        P
                      </div>
                      <p className="text-[11px] font-bold">{card.pill.text}</p>
                    </div>
                    {card.pillBadge && (
                      <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-[10px] px-3 py-2 rounded-xl z-20 shadow-md"
                        style={{ background: card.pillBadge.color, color: "black" }}
                      >
                        {card.pillBadge.text}
                      </div>
                    )}
                  </>
                )}
                {card.badge && (
                  <div
                    className="flex flex-col items-center rounded-[1.5rem] px-6 py-4 shadow-lg relative w-full max-w-[220px]"
                    style={{ background: card.badge.bg, color: card.badge.color }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-1">ANALYSIS RESULT</p>
                    <p className="text-sm font-black">{card.badge.text}</p>
                    <div
                      className="absolute -bottom-2 left-8 w-5 h-5 transform rotate-45"
                      style={{ background: card.badge.bg }}
                    />
                  </div>
                )}
              </div>

              {/* Arrow connector between cards (hidden on last) */}
              {i < 2 && (
                <div className="hidden md:block absolute -right-10 bottom-10 w-14 h-14 z-30 opacity-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black stroke-current" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,80 Q 40,20 80,40" />
                    <path d="M60,20 L80,40 L50,60" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Link to full landing */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: "#888", background: "transparent", border: "none", cursor: "pointer" }}
          >
            See all features ↓
          </button>
        </div>
      </section>

      {/* ───── REMAINING SECTIONS (imported inline below) ───── */}
      <div id="features-anchor" />
    </div>
  );
}
