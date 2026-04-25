import React from "react";
import { AuthModal } from "@/components/auth-modal";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      
      <div className="z-10 text-center mb-32">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-6" style={{ fontFamily: "Borel, cursive" }}>
          prysm
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto px-4">
          The AI-driven customer feedback analyzer. Transform scattered feedback into actionable product insights.
        </p>
      </div>

      <AuthModal isOpen={true} />
    </div>
  );
}
