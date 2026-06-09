import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40" />

      <div className="z-10 w-full max-w-[600px] bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          [Privacy Policy Content goes here]
        </p>
        <div className="mt-4">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
