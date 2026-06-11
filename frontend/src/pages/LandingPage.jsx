import React, { useState } from "react";
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

/* ─── Bottom feature cards data ─── */
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

/* ─── Interactive Demo mock data ─── */
const demoChannels = {
  x: {
    name: "X / NITTER",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    sentiment: "68% POSITIVE",
    summary: "Users are highly receptive to the privacy-first model and local data hosting. A few mentions of UI filters needing optimization on smaller screens, and transient rate limits on the public Nitter RSS instances.",
    cards: [
      {
        user: "@lex_dev",
        time: "2h ago",
        text: "Prysm's BYOK model is exactly what I wanted. Paying raw API costs to OpenAI/Gemini is 10x cheaper than paying middleman SaaS markups.",
        sentiment: "positive"
      },
      {
        user: "@product_growth",
        time: "5h ago",
        text: "Ingested X feeds for my launch, and the sentiment parsing is incredibly fast. Mobile UI filter options could be slightly more prominent though.",
        sentiment: "neutral"
      },
      {
        user: "@security_first",
        time: "1d ago",
        text: "Having my API keys saved in localstorage instead of a third-party server is a game changer for enterprise compliance.",
        sentiment: "positive"
      }
    ]
  },
  appstore: {
    name: "APP STORE",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
      </svg>
    ),
    sentiment: "74% POSITIVE",
    summary: "Strong ratings regarding visual aesthetics and performance. One bug identified on app startup for iOS 15 users, which has been flagged as high-priority for the engineering queue.",
    cards: [
      {
        user: "Sarah K.",
        time: "10m ago",
        text: "The new dashboard layout is beautiful. Dark mode looks incredible.",
        sentiment: "positive"
      },
      {
        user: "Marcus V.",
        time: "1d ago",
        text: "App crashes immediately on startup since the 2.4.0 update on my iPhone 13. Please hotfix!",
        sentiment: "negative"
      }
    ]
  },
  playstore: {
    name: "PLAY STORE",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.523 15.3l-3.327-3.3 3.327-3.3 4.127 2.4a2.53 2.53 0 0 1 0 4.4zM2.873 2.7l10.377 10.278L2.873 23.3a2.44 2.44 0 0 1-.373-1.32V4.02a2.44 2.44 0 0 1 .373-1.32zm11.25 11.2l-3.1-3.1L2.873 2.7a2.15 2.15 0 0 1 1.45-.6h.15l13.05 7.6zm0-3.8l-13.05-7.6h-.15a2.15 2.15 0 0 1-1.45.6L11.023 10.8z"/>
      </svg>
    ),
    sentiment: "82% POSITIVE",
    summary: "Highly rated overall. Android users love the speed and responsiveness. Minor requests for offline sync capabilities to allow reading reports without an active internet connection.",
    cards: [
      {
        user: "Dmitri G.",
        time: "3h ago",
        text: "Super fast, lightweight, and does exactly what it promises. Five stars.",
        sentiment: "positive"
      },
      {
        user: "Elena R.",
        time: "2d ago",
        text: "I love it, but is there any way to export reports offline? It would be great to read them during my commute.",
        sentiment: "neutral"
      }
    ]
  },
  gmail: {
    name: "GMAIL / INBOX",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    sentiment: "45% URGENT",
    summary: "Support inbox contains critical billing questions, API access token support, and standard refund requests. No system outages reported.",
    cards: [
      {
        user: "finance@corp.com",
        time: "12m ago",
        text: "Can you send the PDF invoice for our corporate subscription? Our accounting system needs it for audit.",
        sentiment: "neutral"
      },
      {
        user: "jon.smith@gmail.com",
        time: "4h ago",
        text: "Accidentally subscribed twice. Requesting a refund for the duplicate transaction.",
        sentiment: "negative"
      }
    ]
  },
  csv: {
    name: "CUSTOM CSV",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    sentiment: "88% PARSED",
    summary: "Custom CSV module successfully parsed 4,200 rows of user interview logs. Identified pricing concerns and requested integration expansions (Intercom, Discord) as primary topics.",
    cards: [
      {
        user: "user_interviews.csv",
        time: "Just now",
        text: "Successfully parsed 1,280 reviews. Primary cluster: 'Feature Request: Discord integration'.",
        sentiment: "positive"
      },
      {
        user: "support_export.csv",
        time: "10m ago",
        text: "Identified recurring topic: 'Pricing is too high for indie developers' (28 mentions).",
        sentiment: "neutral"
      }
    ]
  }
};

/* ─── FAQ Accordion mock data ─── */
const faqItems = [
  {
    q: "How does the Bring Your Own Key (BYOK) model work?",
    a: "Instead of paying us a markup on AI calls, you supply your own API key for OpenAI, Gemini, Claude, Groq, or run a local Ollama server. Prysm connects directly to the provider. You pay them directly for raw token usage, and we don't charge any platform fee on top of it."
  },
  {
    q: "Are my API keys and feedback data secure?",
    a: "Yes. Your API keys are stored strictly in your local browser storage and never sent to our servers. Raw feedbacks are stored in your own secure MongoDB database instance. Prysm is built from the ground up for strict privacy compliance."
  },
  {
    q: "Which integrations are currently supported?",
    a: "Prysm supports live feeds from App Store Reviews, Play Store Reviews, X (via Nitter RSS), and custom data CSV uploads. Gmail fetching is supported in the API structure for manual triggering, with more channels being added constantly."
  },
  {
    q: "Can I run Prysm completely locally?",
    a: "Absolutely. You can run both the frontend and backend locally on your system, configure it to connect to your local MongoDB instance, and run analysis using Ollama (e.g. llama3, mistral) with zero external network dependencies."
  }
];

/* ─────────────────────── MAIN LANDING PAGE ─────────────────────── */
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("x");
  const [openFaq, setOpenFaq] = useState(null);

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
          {["Features", "How It Works", "Data Flow", "Pricing & FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => {
                const id = item.toLowerCase().replace(/ /g, "-").replace("&", "and");
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
      <main className="relative z-10 pt-8 pb-16 md:pt-12 md:pb-28 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">
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
            className="text-center max-w-[600px] px-4 font-mono uppercase tracking-widest leading-relaxed text-white/50"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "1px" }}
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

      {/* ───── DARK BOTTOM FEATURE CARDS ───── */}
      <section
        id="quick-features"
        className="text-white px-6 py-16 md:px-10 md:py-24 relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="rounded-[2rem] p-8 flex flex-col items-center text-center relative border transition-all duration-300 hover:border-[#CCFF00]/40 group"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", minHeight: "16rem" }}
            >
              <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black tracking-tight" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                {card.label}
              </h3>
              <p className="text-[10px] md:text-xs font-mono mb-auto uppercase tracking-wider text-white/50" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {card.sub}
              </p>

              {/* Pill / badge graphic */}
              <div className="relative w-full flex justify-center mt-6">
                {card.pill && (
                  <>
                    <div
                      className="flex items-center rounded-2xl p-3 pr-20 text-white shadow-lg relative z-10"
                      style={{ background: "#111" }}
                    >
                      <div
                        className="w-7 h-7 rounded-full mr-3 flex-shrink-0 flex items-center justify-center font-black text-xs"
                        style={{ background: "#CCFF00", color: "black" }}
                      >
                        P
                      </div>
                      <p className="text-[11px] font-mono tracking-wider">{card.pill.text}</p>
                    </div>
                    {card.pillBadge && (
                      <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-[10px] px-3 py-2 rounded-xl z-20 shadow-md font-mono"
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
                    style={{ background: "#CCFF00", color: "black" }}
                  >
                    <p className="text-[9px] font-mono font-bold uppercase tracking-wider mb-1">ANALYSIS RESULT</p>
                    <p className="text-xs font-mono font-black">{card.badge.text}</p>
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 transform rotate-45"
                      style={{ background: "#CCFF00" }}
                    />
                  </div>
                )}
              </div>

              {/* Arrow connector between cards (hidden on last) */}
              {i < 2 && (
                <div className="hidden md:block absolute -right-10 bottom-10 w-14 h-14 z-30 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white stroke-current" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20,80 Q 40,20 80,40" />
                    <path d="M60,20 L80,40 L50,60" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Link to how it works */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-60 text-white/50 bg-transparent border-none cursor-pointer"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Interactive Demo ↓
          </button>
        </div>
      </section>

      {/* ───── SECTION: HOW IT WORKS (INTERACTIVE DEMO) ───── */}
      <section
        id="how-it-works"
        className="text-white px-6 py-20 md:px-10 md:py-28 relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="w-full flex flex-col items-center text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[#CCFF00] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              01 // INTERACTIVE WORKFLOW
            </p>
            <h2
              className="font-black leading-none tracking-tighter uppercase mb-4"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: "#F5F5F0",
                textShadow: "3px 3px 0 #1a1a1a, 6px 6px 0 #000000",
              }}
            >
              HOW IT WORKS
            </h2>
            <p className="font-mono text-xs text-white/50 max-w-xl leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Select a channel to see how Prysm gathers feedback, parses sentiments, and creates summaries dynamically.
            </p>
          </div>

          {/* Section main split */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
            {/* Left Column: Explanations */}
            <div className="space-y-6">
              <div className="border border-white/10 rounded-3xl p-6 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 bg-[#CCFF00] text-black font-bold rounded">01</span>
                  <h3 className="text-lg font-black uppercase">Ingestion</h3>
                </div>
                <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Connect to App Store, Play Store, X (Nitter RSS), Gmail, or drag a custom CSV. Data is loaded and structured in your own MongoDB.
                </p>
              </div>

              <div className="border border-white/10 rounded-3xl p-6 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 bg-[#CCFF00] text-black font-bold rounded">02</span>
                  <h3 className="text-lg font-black uppercase">API Connectivity</h3>
                </div>
                <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  Provide your LLM credentials (stored locally). Calls are sent directly from your system to OpenAI, Gemini, or Claude. No markups.
                </p>
              </div>

              <div className="border border-white/10 rounded-3xl p-6 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 bg-[#CCFF00] text-black font-bold rounded">03</span>
                  <h3 className="text-lg font-black uppercase">Sentiment & Themes</h3>
                </div>
                <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  AI analyzes reviews individually. Sentiments are mapped, topics are categorized, and urgent tickets are flagged for product updates.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Demo shell */}
            <div className="border border-white/10 rounded-[2.5rem] bg-[#0E0E0E] p-6 shadow-2xl relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#10B981]" />
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  [CORE_SYS_MONITOR: ACTIVE]
                </div>
              </div>

              {/* Tab Selectors */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(demoChannels).map((key) => {
                  const ch = demoChannels[key];
                  const active = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer bg-transparent"
                      style={{
                        background: active ? "#CCFF00" : "rgba(255,255,255,0.02)",
                        color: active ? "black" : "white",
                        borderColor: active ? "#CCFF00" : "rgba(255,255,255,0.1)",
                        boxShadow: active ? "0 0 15px rgba(204,255,0,0.2)" : "none"
                      }}
                    >
                      {ch.icon}
                      <span>{ch.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Workspace Display */}
              <div className="space-y-4">
                {/* Sentiment bar & quick indicator */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    CHANNEL SENTIMENT RATIO:
                  </span>
                  <span className="font-mono text-xs font-bold text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {demoChannels[activeTab].sentiment}
                  </span>
                </div>

                {/* Cards container */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {demoChannels[activeTab].cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border bg-white/[0.01]"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-white/80" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          {card.user}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-white/40">{card.time}</span>
                          <span
                            className="font-mono text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase"
                            style={{
                              background: card.sentiment === "positive" ? "rgba(204,255,0,0.15)" : card.sentiment === "negative" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                              color: card.sentiment === "positive" ? "#CCFF00" : card.sentiment === "negative" ? "#EF4444" : "#AAA"
                            }}
                          >
                            {card.sentiment}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-sans">{card.text}</p>
                    </div>
                  ))}
                </div>

                {/* AI Summary Block */}
                <div className="p-5 rounded-2xl border bg-white/[0.02] relative" style={{ borderColor: "#CCFF00" }}>
                  <div className="absolute top-0 right-6 -translate-y-1/2 font-mono text-[8px] px-3 py-1 bg-[#CCFF00] text-black font-black uppercase tracking-widest rounded-full">
                    AI SUMMARIZATION
                  </div>
                  <h4 className="font-mono text-[10px] uppercase text-white/40 tracking-wider mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    computed insights:
                  </h4>
                  <p className="font-mono text-xs text-white/90 leading-relaxed" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {demoChannels[activeTab].summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION: DATA FLOW CONNECTOR ───── */}
      <section
        id="data-flow"
        className="text-white px-6 py-20 md:px-10 md:py-28 relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="w-full flex flex-col items-center text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[#CCFF00] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              02 // ARCHITECTURE PIPELINE
            </p>
            <h2
              className="font-black leading-none tracking-tighter uppercase mb-4"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: "#F5F5F0",
                textShadow: "3px 3px 0 #1a1a1a, 6px 6px 0 #000000",
              }}
            >
              CONNECTIVITY MAP
            </h2>
            <p className="font-mono text-xs text-white/50 max-w-xl leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              See how data streams from diverse platforms, converges in Prysm aggregator, and branches out to your preferred LLMs.
            </p>
          </div>

          {/* Connectivity diagram wrapper */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-4xl border border-white/10 rounded-[2.5rem] bg-[#0E0E0E] p-4 md:p-8 overflow-hidden shadow-2xl">
              <svg viewBox="0 0 800 480" className="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
                {/* Defs for gradients & glows */}
                <defs>
                  <filter id="glow-neon" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* FLOW LINES LEFT TO CENTER */}
                {/* Path 1: App Store (y=60) */}
                <path d="M 190,60 C 260,60 260,240 310,240" fill="none" stroke="url(#grad-left)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 2: Play Store (y=150) */}
                <path d="M 190,150 C 260,150 260,240 310,240" fill="none" stroke="url(#grad-left)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 3: X / Nitter (y=240) */}
                <path d="M 190,240 L 310,240" fill="none" stroke="url(#grad-left)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 4: Gmail (y=330) */}
                <path d="M 190,330 C 260,330 260,240 310,240" fill="none" stroke="url(#grad-left)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 5: CSV (y=420) */}
                <path d="M 190,420 C 260,420 260,240 310,240" fill="none" stroke="url(#grad-left)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />

                {/* FLOW LINES CENTER TO RIGHT */}
                {/* Path 6: Gemini (y=60) */}
                <path d="M 490,240 C 540,240 540,60 610,60" fill="none" stroke="url(#grad-right)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 7: OpenAI (y=150) */}
                <path d="M 490,240 C 540,240 540,150 610,150" fill="none" stroke="url(#grad-right)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 8: Claude (y=240) */}
                <path d="M 490,240 L 610,240" fill="none" stroke="url(#grad-right)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 9: Groq (y=330) */}
                <path d="M 490,240 C 540,240 540,330 610,330" fill="none" stroke="url(#grad-right)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                {/* Path 10: Ollama (y=420) */}
                <path d="M 490,240 C 540,240 540,420 610,420" fill="none" stroke="url(#grad-right)" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />

                {/* ANIMATED PULSES LEFT */}
                <circle r="4" fill="#CCFF00" filter="url(#glow-neon)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 190,60 C 260,60 260,240 310,240" />
                </circle>
                <circle r="4" fill="#CCFF00" filter="url(#glow-neon)">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M 190,150 C 260,150 260,240 310,240" />
                </circle>
                <circle r="4" fill="#CCFF00" filter="url(#glow-neon)">
                  <animateMotion dur="3.8s" repeatCount="indefinite" path="M 190,240 L 310,240" />
                </circle>
                <circle r="4" fill="#CCFF00" filter="url(#glow-neon)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 190,330 C 260,330 260,240 310,240" />
                </circle>
                <circle r="4" fill="#CCFF00" filter="url(#glow-neon)">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M 190,420 C 260,420 260,240 310,240" />
                </circle>

                {/* ANIMATED PULSES RIGHT */}
                <circle r="4" fill="#10B981" filter="url(#glow-neon)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path="M 490,240 C 540,240 540,60 610,60" />
                </circle>
                <circle r="4" fill="#10B981" filter="url(#glow-neon)">
                  <animateMotion dur="3.4s" repeatCount="indefinite" path="M 490,240 C 540,240 540,150 610,150" />
                </circle>
                <circle r="4" fill="#10B981" filter="url(#glow-neon)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 490,240 L 610,240" />
                </circle>
                <circle r="4" fill="#10B981" filter="url(#glow-neon)">
                  <animateMotion dur="3.6s" repeatCount="indefinite" path="M 490,240 C 540,240 540,330 610,330" />
                </circle>
                <circle r="4" fill="#10B981" filter="url(#glow-neon)">
                  <animateMotion dur="3.0s" repeatCount="indefinite" path="M 490,240 C 540,240 540,420 610,420" />
                </circle>

                {/* LEFT COLUMN: SOURCES */}
                <foreignObject x="10" y="30" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#CCFF00] text-black font-black text-[10px]">A</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">App Store Reviews</div>
                  </div>
                </foreignObject>
                <foreignObject x="10" y="120" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#CCFF00] text-black font-black text-[10px]">P</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Play Store Reviews</div>
                  </div>
                </foreignObject>
                <foreignObject x="10" y="210" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#CCFF00] text-black font-black text-[10px]">X</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">X / Nitter RSS</div>
                  </div>
                </foreignObject>
                <foreignObject x="10" y="300" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#CCFF00] text-black font-black text-[10px]">M</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Gmail Feed</div>
                  </div>
                </foreignObject>
                <foreignObject x="10" y="390" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#CCFF00] text-black font-black text-[10px]">C</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Custom CSV Data</div>
                  </div>
                </foreignObject>

                {/* CENTER NODE: PRYSM ORCHESTRATOR */}
                <foreignObject x="310" y="195" width="180" height="110">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center p-3 rounded-[2rem] border bg-black/80 w-[180px] h-[90px]" style={{ borderColor: "#CCFF00", boxShadow: "0 0 25px rgba(204,255,0,0.15)" }}>
                    <div className="font-black tracking-tight text-[11px] px-2 py-1 bg-white text-black rounded-lg mb-1.5">PRYSM</div>
                    <div className="font-mono text-[8px] font-black text-[#CCFF00] tracking-widest uppercase">[ORCHESTRATOR]</div>
                  </div>
                </foreignObject>

                {/* RIGHT COLUMN: LLM PROVIDERS */}
                <foreignObject x="610" y="30" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-black font-black text-[8px]">G</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Gemini API</div>
                  </div>
                </foreignObject>
                <foreignObject x="610" y="120" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-black font-black text-[8px]">O</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">OpenAI API</div>
                  </div>
                </foreignObject>
                <foreignObject x="610" y="210" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-black font-black text-[8px]">C</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Claude API</div>
                  </div>
                </foreignObject>
                <foreignObject x="610" y="300" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-black font-black text-[8px]">R</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Groq API</div>
                  </div>
                </foreignObject>
                <foreignObject x="610" y="390" width="180" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/60 w-[170px] h-[50px]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-black font-black text-[8px]">L</div>
                    <div className="font-mono text-[9px] font-black uppercase text-white tracking-wider">Ollama Local</div>
                  </div>
                </foreignObject>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION: CAPABILITIES ───── */}
      <section
        id="features"
        className="text-white px-6 py-20 md:px-10 md:py-28 relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="w-full flex flex-col items-center text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[#CCFF00] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              03 // CAPABILITIES ENGINE
            </p>
            <h2
              className="font-black leading-none tracking-tighter uppercase mb-4"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: "#F5F5F0",
                textShadow: "3px 3px 0 #1a1a1a, 6px 6px 0 #000000",
              }}
            >
              CORE CAPABILITIES
            </h2>
            <p className="font-mono text-xs text-white/50 max-w-xl leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Privacy-first analytics with modern dashboard panels, built for professional teams.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="border border-white/10 rounded-[2rem] p-8 bg-white/[0.01] hover:border-[#CCFF00]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono text-xs text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  [CAP_SYS_INGEST]
                </div>
                <div className="font-mono text-[9px] px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-emerald-400">
                  SYS_OK
                </div>
              </div>
              <h3 className="text-xl font-black uppercase mb-3" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                Multi-Source Ingestion
              </h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Load data streams from App Store, Play Store, X (RSS Feed), Gmail inbox, or drag custom CSV file reports directly. All feedback sits securely in your database.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-white/10 rounded-[2rem] p-8 bg-white/[0.01] hover:border-[#CCFF00]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono text-xs text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  [CAP_SYS_ECONOMICS]
                </div>
                <div className="font-mono text-[9px] px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-emerald-400">
                  SYS_OK
                </div>
              </div>
              <h3 className="text-xl font-black uppercase mb-3" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                BYOK Model Economics
              </h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Supply your own API key for Gemini, OpenAI, Claude, Groq, or run Ollama completely locally. Zero markup. Your keys, your billing, total cost transparency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-white/10 rounded-[2rem] p-8 bg-white/[0.01] hover:border-[#CCFF00]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono text-xs text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  [CAP_SYS_ANALYSIS]
                </div>
                <div className="font-mono text-[9px] px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-emerald-400">
                  SYS_OK
                </div>
              </div>
              <h3 className="text-xl font-black uppercase mb-3" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                Sentiment Parsing
              </h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Automatically classify positive, neutral, and negative feedbacks. Group feedback by topics, track trends, and identify regression points instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border border-white/10 rounded-[2rem] p-8 bg-white/[0.01] hover:border-[#CCFF00]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="font-mono text-xs text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  [CAP_SYS_SECURITY]
                </div>
                <div className="font-mono text-[9px] px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-emerald-400">
                  SYS_OK
                </div>
              </div>
              <h3 className="text-xl font-black uppercase mb-3" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                Secure History Storage
              </h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Keep track of previous analysis reports. Compare feedback changes over time without calling the LLM again. Safe data management out-of-the-box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION: PRICING & FAQ ───── */}
      <section
        id="pricing-and-faq"
        className="text-white px-6 py-20 md:px-10 md:py-28 relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="w-full flex flex-col items-center text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-[#CCFF00] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              04 // ECONOMICS & Q&A
            </p>
            <h2
              className="font-black leading-none tracking-tighter uppercase mb-4"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                color: "#F5F5F0",
                textShadow: "3px 3px 0 #1a1a1a, 6px 6px 0 #000000",
              }}
            >
              PRICING & FAQ
            </h2>
          </div>

          {/* Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
            {/* Left Column: Pricing Receipt Card */}
            <div className="relative flex justify-center">
              {/* Receipt Ticket Container */}
              <div
                className="w-full max-w-sm rounded-3xl p-8 relative flex flex-col justify-between overflow-hidden border border-white/10"
                style={{
                  background: "#111",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Neon receipt top indicator */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#CCFF00]" />

                {/* Receipt Header */}
                <div className="border-b border-dashed border-white/20 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-xl tracking-tight uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                      PRYSM AI
                    </span>
                    <span className="font-mono text-[10px] text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      [BYOK_TIER]
                    </span>
                  </div>
                  <p className="font-mono text-[9px] uppercase text-white/40" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    privacy-first feedback engine
                  </p>
                </div>

                {/* Receipt Item List */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-white/50 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      01 // PRYSM CORE SOFTWARE
                    </span>
                    <span className="font-mono font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-white/50 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      02 // UNLIMITED INTEGRATIONS
                    </span>
                    <span className="font-mono font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      INCLUDED
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-white/50 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      03 // LOCAL KEY STORAGE
                    </span>
                    <span className="font-mono font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      INCLUDED
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-white/50 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      04 // LOCAL MONGO DATABASE
                    </span>
                    <span className="font-mono font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      INCLUDED
                    </span>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="border-t border-dashed border-white/20 pt-6 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-white/40 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      PLATFORM TOTAL:
                    </span>
                    <span className="font-mono text-sm text-white/50" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      $0.00 / MO
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                      NET COST:
                    </span>
                    <span className="font-black text-2xl text-[#CCFF00]" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                      $0.00
                    </span>
                  </div>
                </div>

                {/* Barcode and Sub-receipt details */}
                <div className="flex flex-col items-center gap-3">
                  {/* Barcode SVG */}
                  <svg viewBox="0 0 100 20" className="w-48 h-8 opacity-60 text-white fill-current">
                    <rect x="0" y="0" width="2" height="20" />
                    <rect x="4" y="0" width="1" height="20" />
                    <rect x="7" y="0" width="3" height="20" />
                    <rect x="12" y="0" width="1" height="20" />
                    <rect x="15" y="0" width="2" height="20" />
                    <rect x="19" y="0" width="4" height="20" />
                    <rect x="25" y="0" width="1" height="20" />
                    <rect x="28" y="0" width="2" height="20" />
                    <rect x="32" y="0" width="1" height="20" />
                    <rect x="35" y="0" width="3" height="20" />
                    <rect x="40" y="0" width="1" height="20" />
                    <rect x="43" y="0" width="2" height="20" />
                    <rect x="47" y="0" width="4" height="20" />
                    <rect x="53" y="0" width="1" height="20" />
                    <rect x="56" y="0" width="3" height="20" />
                    <rect x="61" y="0" width="1" height="20" />
                    <rect x="64" y="0" width="2" height="20" />
                    <rect x="68" y="0" width="4" height="20" />
                    <rect x="74" y="0" width="1" height="20" />
                    <rect x="77" y="0" width="2" height="20" />
                    <rect x="81" y="0" width="1" height="20" />
                    <rect x="84" y="0" width="3" height="20" />
                    <rect x="89" y="0" width="1" height="20" />
                    <rect x="92" y="0" width="2" height="20" />
                    <rect x="96" y="0" width="4" height="20" />
                  </svg>
                  <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    # SECURE_BYOK_BY_PRYSM
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: FAQ Accordion */}
            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-3xl border transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.01)",
                      borderColor: isOpen ? "#CCFF00" : "rgba(255,255,255,0.08)"
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer bg-transparent border-none"
                    >
                      <span className="font-black text-sm uppercase md:text-base text-white" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                        {item.q}
                      </span>
                      <span className="font-mono text-lg text-[#CCFF00]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {isOpen ? "[-]" : "[+]"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-0">
                        <p className="font-mono text-xs text-white/70 leading-relaxed uppercase pt-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer
        className="relative z-20 w-full"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <div
                  className="font-black tracking-tight text-xs md:text-sm px-3 py-1.5"
                  style={{ background: "white", color: "black", borderRadius: "1rem 1rem 1rem 0.2rem" }}
                >
                  PRYSM
                </div>
                <div
                  className="font-black text-xs md:text-sm px-3 py-1.5 rounded-full"
                  style={{ background: "#CCFF00", color: "black", border: "1.5px solid white" }}
                >
                  AI
                </div>
              </div>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider max-w-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                BYOK feedback aggregator for product intelligence. Zero middleman markup. 100% data privacy.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase text-white/80" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                PRODUCT
              </h4>
              <ul className="space-y-2">
                {["Features", "How It Works", "Data Flow", "Pricing & FAQ"].map((name) => (
                  <li key={name}>
                    <button
                      onClick={() => {
                        const id = name.toLowerCase().replace(/ /g, "-").replace("&", "and");
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="font-mono text-[10px] text-white/50 uppercase hover:text-[#CCFF00] tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Docs */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase text-white/80" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                LEGAL & HELP
              </h4>
              <ul className="space-y-2">
                {[
                  { name: "Terms of Use", path: "/terms" },
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Documentation", path: "/docs" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="font-mono text-[10px] text-white/50 uppercase hover:text-[#CCFF00] tracking-wider transition-colors"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Block */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-[10px] font-mono uppercase text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <div>© {new Date().getFullYear()} PRYSM CORP. ALL RIGHTS RESERVED.</div>
            <div className="mt-2 md:mt-0 flex gap-4">
              <span>[REACT + NODE + MONGODB]</span>
              <span>[BYOK ENCRYPTED]</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
