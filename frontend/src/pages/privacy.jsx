import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import privacyContent from "./components2/privacy-content";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40" />

      <div className="z-10 w-full max-w-4xl bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Privacy Policy
        </h1>

        <div className="space-y-8">
          {privacyContent.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-semibold text-white mb-3">
                {section.title}
              </h2>

              {section.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm text-muted-foreground leading-7 mb-3"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
                  {section.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
