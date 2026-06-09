import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Twitter,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export function XConnectModal({ isOpen, onClose, onConnect }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [handle, setHandle] = useState("");

  const handleInputChange = (e) => {
    setHandle(e.target.value);
    setError(null);
  };

  const handleConnect = async () => {
    if (!handle) {
      setError("Please enter an X username (e.g. @google)");
      return;
    }

    const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
    setIsLoading(true);
    setError(null);

    try {
      // Real API call to verify account via Nitter scraper
      const res = await axiosInstance.get(`/x/feedback/${cleanHandle.replace("@", "")}`);
      
      if (!res.data || res.data.length === 0) {
        throw new Error("No recent posts found for this account. Is it active and public?");
      }

      const appData = {
        name: cleanHandle,
        icon: `https://unavatar.io/twitter/${cleanHandle.replace("@", "")}`,
        count: res.data.length
      };

      onConnect(appData);
      onClose();
      toast.success(`Connected to X — Fetched ${res.data.length} recent posts from ${cleanHandle}`);

      // Reset state
      setHandle("");
    } catch (err) {
      console.error("X Connection Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to connect to X. The account might be private or Nitter instances are down.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => {
        setError(null);
        setHandle("");
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5" /> Connect X
          </DialogTitle>
          <DialogDescription>
            Enter X username to start getting feedback
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="handle" className="text-sm font-medium">
              X Username
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="handle"
                className="pl-9"
                placeholder="e.g. @google"
                value={handle}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Prysm gets feedback from X in real-time.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isLoading || !handle}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Verify & Connect"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
