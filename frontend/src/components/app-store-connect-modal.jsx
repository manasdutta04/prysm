import React, { useState, useRef } from "react";
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
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";

export function AppStoreConnectModal({ isOpen, onClose, onConnect }) {
  const [step, setStep] = useState("credentials"); // credentials, select
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    issuerId: "",
    keyId: "",
    p8File: null,
  });
  const [foundApps, setFoundApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".p8")) {
        setError("Please upload a valid .p8 file");
        return;
      }
      setCredentials((prev) => ({ ...prev, p8File: file }));
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleValidate = async () => {
    if (!credentials.p8File || !credentials.issuerId || !credentials.keyId) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock API call to validate
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock validation logic
      if (credentials.issuerId.length < 5) {
        throw new Error(
          "Issuer ID seems wrong. Check your App Store Connect account.",
        );
      }

      // Mock success with found apps
      const mockApps = [
        { id: "1", name: "Prysm App", bundleId: "io.prysm.app", icon: null },
        // Uncomment to test multiple apps
        // { id: '2', name: 'Prysm Beta', bundleId: 'io.prysm.beta', icon: null }
      ];

      setFoundApps(mockApps);

      if (mockApps.length === 1) {
        setSelectedAppId(mockApps[0].id);
        setStep("confirm"); // Skip selection if only one app
      } else {
        setStep("select");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Mock API call to connect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const app = foundApps.find((a) => a.id === selectedAppId);
      onConnect(app);
      onClose();
      toast.success(`Connected — ${app.name}. First sync scheduled.`);

      // Reset state
      setStep("credentials");
      setCredentials({ issuerId: "", keyId: "", p8File: null });
      setFoundApps([]);
      setSelectedAppId(null);
    } catch (err) {
      toast.error("Failed to connect app", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => {
        setStep("credentials");
        setError(null);
        setCredentials({ issuerId: "", keyId: "", p8File: null });
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect App Store</DialogTitle>
          <DialogDescription>
            Enter your App Store Connect credentials to sync your app data.
            <br />
            <span
              className="text-primary cursor-pointer hover:underline text-xs"
              onClick={() => {
                setCredentials({
                  issuerId: "demo-issuer-id-123",
                  keyId: "demo-key-id-456",
                  p8File: { name: "AuthKey_DEMO123.p8" },
                });
                setError(null);
              }}
            >
              Don't have keys? Try with demo data
            </span>
          </DialogDescription>
        </DialogHeader>

        {step === "credentials" && (
          <div className="grid gap-4 py-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".p8"
                onChange={handleFileChange}
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-sm font-medium">
                {credentials.p8File
                  ? credentials.p8File.name
                  : "Upload .p8 file"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to upload
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="issuerId" className="text-sm font-medium">
                Issuer ID
              </label>
              <Input
                id="issuerId"
                name="issuerId"
                placeholder="Enter Issuer ID"
                value={credentials.issuerId}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="keyId" className="text-sm font-medium">
                Key ID
              </label>
              <Input
                id="keyId"
                name="keyId"
                placeholder="Enter Key ID"
                value={credentials.keyId}
                onChange={handleInputChange}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {(step === "select" || step === "confirm") && (
          <div className="py-4">
            <div className="text-sm font-medium mb-4">
              {step === "confirm"
                ? "We found your app:"
                : "Select an app to connect:"}
            </div>

            <div className="space-y-2">
              {foundApps.map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAppId === app.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => step === "select" && setSelectedAppId(app.id)}
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{app.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.bundleId}
                    </div>
                  </div>
                  {selectedAppId === app.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={resetModal} disabled={isLoading}>
            Cancel
          </Button>
          {step === "credentials" ? (
            <Button onClick={handleValidate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Validate & Connect"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isLoading || !selectedAppId}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Confirm & Connect"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
