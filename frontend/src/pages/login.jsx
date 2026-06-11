import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [view, setView] = useState("login"); // "login" or "register"
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
    setForm({ fullName: "", email: "", password: "" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white overflow-hidden w-full font-sans">
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
      </header>

      {/* Login Box */}
      <div className="z-10 w-full max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-4xl italic font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {view === "login" ? "Welcome back" : "Join Prysm"}
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-white/50" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {view === "login"
              ? "Access your unified feedback dashboard."
              : "Start analyzing feedback securely."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "register" && (
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]"
              />
            </div>
          </div>

          <LiquidButton type="submit" size="lg" className="w-full text-white font-bold tracking-wide mt-2" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                {view === "login" ? "Authenticating..." : "Creating Account..."}
              </span>
            ) : (
              view === "login" ? "Sign In" : "Create Account"
            )}
          </LiquidButton>
        </form>

        <div className="text-center text-sm text-zinc-400">
          {view === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleView}
            className="font-bold text-[#CCFF00] hover:underline cursor-pointer"
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
