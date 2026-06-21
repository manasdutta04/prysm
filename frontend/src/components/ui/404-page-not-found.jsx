import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

/* ─── Hand-drawn SVG accents from LandingPage ─── */
const ArrowGreenLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full stroke-current overflow-visible"
    style={{ color: "#CCFF00" }}
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

export default function NotFoundPage() {
  // 3D text shadow array matching landing page hero title
  const textShadow3D = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map((n) => `${n}px ${n}px 0 #1a1a00`)
    .join(", ");

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-hidden w-full bg-[#0A0A0A] text-white"
      style={{
        selection: "background: #CCFF00; color: black",
      }}
    >
      {/* Background grid matching LandingPage */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Center ambient glow matching LandingPage */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header/Navbar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 max-w-[1440px] mx-auto w-full">
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
      </header>

      {/* Main Hero-style Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-4 pb-20 px-4 max-w-[1440px] mx-auto w-full text-center">
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center mb-10">
          
          {/* Headline block */}
          <div className="w-full flex flex-col items-center gap-2 relative z-10">
            {/* Huge 404 Heading with 3D Text Shadow */}
            <div className="w-full flex justify-center relative z-20">
              <h1
                className="font-normal leading-[0.85] tracking-tighter m-0 p-0 italic select-none"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(6rem, 18vw, 240px)",
                  color: "#CCFF00",
                  textShadow: textShadow3D,
                }}
              >
                404
              </h1>
            </div>

            {/* Subhead: Swapped lines, line 1 is larger */}
            <div className="w-full flex flex-col items-center gap-1 mt-5 relative z-30">
              <h2
                className="font-normal text-white italic tracking-tight m-0 p-0"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(2rem, 5.2vw, 4.2rem)",
                }}
              >
                Nothing found.
              </h2>
              <p
                className="font-normal text-zinc-300 italic m-0 p-0 mt-1"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                  letterSpacing: "0.04em",
                }}
              >
                Just like her feelings for you 🥀
              </p>
            </div>
          </div>

          {/* SVG Arrow Accents */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Arrow Green Left pointing up-right to 404 */}
            <div className="hidden md:block absolute top-[10%] left-[20%] w-28 h-28 z-20">
              <ArrowGreenLeft />
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="relative z-20 flex flex-col items-center gap-8 mt-4">
          <Link to="/">
            <LiquidButton
              size="xl"
              className="text-white font-bold tracking-wide"
            >
              ← You can still go back
            </LiquidButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
