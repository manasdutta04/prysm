import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  { label: "Ingestion", detail: "Capture feedback from sources like Gmail, X, App Store and CSV." },
  { label: "Storage", detail: "Organize raw feedback into searchable collections." },
  { label: "AI Processing", detail: "Run your own LLM key for secure sentiment and insights." },
  { label: "Dashboard", detail: "Monitor metrics, history, and growth trends in one view." },
];

const feedbackTabs = [
  {
    name: "Gmail",
    subtitle: "Email feedback captured via secure OAuth sync.",
    cards: [
      { title: "Billing issue", message: "Customer reports unexpected invoice charge.", sentiment: "Neutral" },
      { title: "Feature request", message: "Needs better export options for reports.", sentiment: "Positive" },
    ],
    summary: "AI distills email threads into urgent actions and sentiment snapshots." 
  },
  {
    name: "Twitter",
    subtitle: "Public product feedback from X Nitter feeds.",
    cards: [
      { title: "UX friction", message: "App feels slow after the latest update.", sentiment: "Negative" },
      { title: "New praise", message: "Loving the new onboarding flow — very smooth.", sentiment: "Positive" },
    ],
    summary: "Social insight cards highlight trending customer pain points instantly." 
  },
  {
    name: "App Store",
    subtitle: "Review scraping across App Store and Play Store.",
    cards: [
      { title: "Crash report", message: "App crashes when opening analytics view.", sentiment: "Negative" },
      { title: "Feature love", message: "App Store review says onboarding is delightful.", sentiment: "Positive" },
    ],
    summary: "Review ingestion converts raw ratings into priority insights." 
  },
];

const features = [
  {
    title: "Multi-Channel Aggregation",
    description: "Sync App Store, Play Store, X Nitter, Gmail, and CSV for a unified view.",
  },
  {
    title: "Bring Your Own Key (BYOK)",
    description: "Privacy-first AI analysis that uses your own LLM provider and token costs only.",
  },
  {
    title: "Insight History Logs",
    description: "Track every analysis run over time and compare evolving customer sentiment.",
  },
  {
    title: "Enterprise Analytics",
    description: "Sentiment gauges, trend lines, and activity charts for faster decision-making.",
  },
];

const audiences = [
  {
    title: "Product Managers",
    details: "Turn scattered feedback into roadmap-ready priorities with zero guesswork.",
  },
  {
    title: "Customer Success",
    details: "Resolve churn drivers faster by surfacing voice-of-customer signals instantly.",
  },
  {
    title: "SaaS Builders",
    details: "Build better products with feedback-based analytics and privacy-first AI.",
  },
];

const faqs = [
  {
    question: "How is my LLM key kept safe?",
    answer: "Prysm never stores your key centrally. You provide your own key locally so AI calls are billed directly by your provider.",
  },
  {
    question: "How often does scraping run?",
    answer: "Scraping schedules are configurable. By default, Prysm refreshes feedback sources hourly with rate-limit safe polling.",
  },
  {
    question: "What Gmail OAuth scopes are required?",
    answer: "Only read-only Gmail scopes are requested for inbox and labels so we can securely ingest feedback without sending mail.",
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(feedbackTabs[0].name);
  const [openFaq, setOpenFaq] = useState(0);

  const currentTab = feedbackTabs.find((tab) => tab.name === activeTab) ?? feedbackTabs[0];

  return (
    <div className="min-h-screen bg-[#071022] text-slate-100 overflow-x-hidden">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(7,16,34,1))]" />
        <div className="absolute left-1/2 top-32 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-16 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-400 to-cyan-400 text-2xl font-black text-slate-950 shadow-xl shadow-violet-500/20">
              P
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-violet-300">Prysm</p>
              <p className="text-xs text-slate-400">Feedback intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/docs" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Docs
            </Link>
            <Link to="/login">
              <Button size="sm" className="rounded-full px-5 py-3 text-sm font-semibold">
                Open App
              </Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-16 lg:px-8">
          <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-violet-500/10">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
                Prysm — feedback intelligence for modern SaaS teams
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl" style={{ fontFamily: "Borel, cursive" }}>
                  Turn scattered feedback into actionable product intelligence.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Prysm ingests reviews, tickets, tweets, and CSV feedback into one privacy-first analytics engine, then surfaces insights using your own LLM key.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/login">
                  <Button size="lg" className="rounded-full px-8 py-4 shadow-lg shadow-violet-500/20 transition-transform duration-300 hover:-translate-y-1">
                    Launch Prysm
                  </Button>
                </Link>
                <Link to="/docs" className="inline-flex items-center text-sm font-medium text-slate-200 transition-colors hover:text-white">
                  Learn how BYOK works <span className="ml-2 text-violet-400">→</span>
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_50px_-30px_rgba(99,102,241,0.8)] backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Sources</p>
                  <p className="mt-3 text-3xl font-semibold text-white">App Store, Gmail, X</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Cost</p>
                  <p className="mt-3 text-3xl font-semibold text-white">Pay your own provider</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">History</p>
                  <p className="mt-3 text-3xl font-semibold text-white">Every run saved</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="rounded-3xl bg-slate-900/80 p-5 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Product Workflow</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">From input to insight in four smooth steps</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {workflowSteps.map((step, index) => (
                  <div key={step.label} className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-violet-500/10">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{`Step ${index + 1}`}</span>
                      <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-violet-200">{step.label}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-200">{step.detail}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-violet-500/10 bg-[#0d1730] p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Interactive demo</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {feedbackTabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab.name ? "bg-violet-400 text-slate-950 shadow-lg shadow-violet-500/20" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {currentTab.cards.map((card) => (
                    <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-slate-950/20 transition hover:scale-[1.01]">
                      <h3 className="text-base font-semibold text-white">{card.title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{card.message}</p>
                      <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.sentiment === "Positive" ? "bg-emerald-500/10 text-emerald-200" : card.sentiment === "Negative" ? "bg-rose-500/10 text-rose-200" : "bg-slate-500/10 text-slate-200"}`}>{card.sentiment}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-3xl border border-white/10 bg-[#111b36] p-5 text-slate-200">
                  <p className="text-sm uppercase tracking-[0.24em] text-violet-300">AI Summary</p>
                  <p className="mt-3 leading-7">{currentTab.summary}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="mb-6 inline-flex items-center rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                <span className="mr-3 h-2.5 w-2.5 rounded-full bg-violet-400" />
                Core capabilities for fast, privacy-safe product intelligence
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-300/20">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <h2 className="text-3xl font-semibold text-white">Target audience</h2>
              <p className="mt-4 text-slate-300">Built for teams that want product intelligence, not platform markup.</p>
              <div className="mt-8 grid gap-4">
                {audiences.map((audience) => (
                  <div key={audience.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:-translate-y-1">
                    <h3 className="text-xl font-semibold text-white">{audience.title}</h3>
                    <p className="mt-2 text-slate-300">{audience.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300">Pricing</p>
              <h2 className="mt-5 text-4xl font-semibold text-white">Free SaaS-ready value with no AI markup.</h2>
              <p className="mt-6 max-w-2xl text-slate-300 leading-8">
                Prysm is cost-effective because you bring your own LLM key. That means you only pay for raw AI usage from your provider, while Prysm stays free to use for aggregation, analytics, and insights.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-violet-500/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-violet-300">BYOK</p>
                  <p className="mt-4 text-lg font-semibold text-white">Pay only for your own token usage.</p>
                </div>
                <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">SaaS economics</p>
                  <p className="mt-4 text-lg font-semibold text-white">No usage surcharge, no hidden fees.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300">FAQ</p>
              <div className="mt-6 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                      className="flex w-full items-center justify-between text-left text-base font-semibold text-white"
                    >
                      <span>{faq.question}</span>
                      <span className="text-violet-300">{openFaq === index ? "−" : "+"}</span>
                    </button>
                    {openFaq === index && (
                      <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer className="border-t border-white/10 bg-slate-950/80 py-8 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <p>Secure BYOK analytics for SaaS teams. Free product intelligence, with your own AI costs.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-slate-400">
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/docs" className="transition hover:text-white">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
