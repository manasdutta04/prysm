import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export function AuthModal({ isOpen, onClose }) {
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
        const res = await login({ email: form.email, password: form.password });
        if (res?.success) {
          onClose();
        }
      } else {
        const res = await signup(form);
        if (res?.success) {
          // Typically registration succeeds and might automatically log them in,
          // or we switch to login view. For now, assuming signup also authenticates
          // or we can switch view to login. 
          toast.success("Account created successfully!");
          setView("login");
        }
      }
    } catch (error) {
      // Errors should be handled in the store, but catching here just in case
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
    setForm({ fullName: "", email: "", password: "" }); // Reset form
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        // Prevent closing by clicking outside if they MUST login
        if (!open) {
          // If you want to allow them to dismiss it (e.g. to see landing page), call onClose
          // We will pass an empty onClose if it's mandatory.
          if (onClose) onClose();
        }
    }}>
      <DialogContent className="sm:max-w-[400px] bg-background/80 backdrop-blur-xl border-border/50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            {view === "login" ? "Welcome Back" : "Join Prysm"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === "login"
              ? "Enter your credentials to access your dashboard."
              : "Create an account to start analyzing customer feedback."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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

        <div className="text-center text-sm text-muted-foreground mt-4">
          {view === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleView}
            className="font-medium text-primary hover:underline"
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
        

      </DialogContent>
    </Dialog>
  );
}
