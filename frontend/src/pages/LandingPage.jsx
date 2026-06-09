import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      
      <div className="z-10 text-center flex flex-col items-center gap-6 max-w-[600px] px-4">
        <h1 
          className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 select-none cursor-default" 
          style={{ fontFamily: "Borel, cursive" }}
        >
          prysm
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-[500px]">
          Transform scattered customer feedback into structured, actionable insights powered by custom LLM orchestration.
        </p>
        <div className="mt-4">
          <Link to="/login">
            <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95">
              Access Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-6 text-xs text-muted-foreground">
        <Link to="/terms" className="hover:text-primary transition-colors">
          Terms of Service
        </Link>
        <span>&bull;</span>
        <Link to="/privacy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
