import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User } from "lucide-react";

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
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-40" />

      <div className="z-10 w-full max-w-[400px] bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-center gap-3">
          <img
            src="/prysm-logo.png"
            alt="Prysm Logo"
            className="h-10 w-auto object-contain"
          />
          <span
            className="font-black text-white tracking-tighter text-xl uppercase"
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            PRYSM
          </span>
        </div>

        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            {view === "login" ? "Welcome Back" : "Join Prysm"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === "login"
              ? "Enter your credentials to access your dashboard."
              : "Create an account to start analyzing customer feedback."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "register" && (
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="pl-9"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {view === "login" ? "Authenticating..." : "Creating Account..."}
              </>
            ) : (
              view === "login" ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {view === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleView}
            className="font-medium text-primary hover:underline"
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
