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
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export function AppStoreConnectModal({ isOpen, onClose, onConnect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foundApps, setFoundApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);
    setFoundApps([]);
    setSelectedApp(null);

    try {
      const res = await axiosInstance.get(`/appstore/search?term=${encodeURIComponent(searchTerm)}`);
      setFoundApps(res.data);
      if (res.data.length === 0) {
        setError("No apps found. Try a different search term.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search App Store");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedApp) return;

    setIsLoading(true);
    try {
      // Fetch initial reviews to verify
      const res = await axiosInstance.get(`/appstore/reviews/${selectedApp.id}`);
      
      onConnect({
        id: selectedApp.id,
        name: selectedApp.name,
        icon: selectedApp.icon,
        bundleId: selectedApp.bundleId,
        reviewsCount: res.data.length
      });
      
      onClose();
      toast.success(`Connected — ${selectedApp.name}. Synced ${res.data.length} recent reviews.`);
      
      // Reset state
      setSearchTerm("");
      setFoundApps([]);
      setSelectedApp(null);
    } catch {
      toast.error("Failed to connect app. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => {
        setError(null);
        setSearchTerm("");
        setFoundApps([]);
        setSelectedApp(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Connect App Store
          </DialogTitle>
          <DialogDescription>
            Search for your app on the App Store to sync customer reviews.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search app name (e.g. WhatsApp, Slack)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={isLoading || !searchTerm}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {foundApps.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
              <p className="text-xs font-medium text-muted-foreground mb-2">Select your app:</p>
              {foundApps.map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-accent border-border"
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="h-12 w-12 rounded-xl bg-muted shrink-0 overflow-hidden border border-border/50">
                    {app.icon ? (
                      <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      <Smartphone className="h-6 w-6 text-muted-foreground m-auto mt-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{app.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {app.developer} • {app.bundleId}
                    </div>
                  </div>
                  {selectedApp?.id === app.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

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
            disabled={isLoading || !selectedApp}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect & Sync"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
