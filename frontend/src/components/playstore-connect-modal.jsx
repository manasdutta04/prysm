import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePlaystoreStore } from "../store/usePlaystoreStore";

export function PlaystoreConnectModal({ isOpen, onClose, onConnect }) {
  const [appId, setAppId] = useState("");
  const { connect, isLoading } = usePlaystoreStore();

  const handleConnect = async () => {
    if (!appId.trim()) return;
    const success = await connect(appId.trim());
    if (success) {
      onConnect({ appId: appId.trim() });
      setAppId("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Play Store</DialogTitle>
          <DialogDescription>
            Enter your app's package ID to connect. You can find it in your
            Play Store URL — e.g.{" "}
            <span className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">
              com.whatsapp
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <label className="text-sm font-medium text-foreground">
            App Package ID
          </label>
          <input
            type="text"
            placeholder="e.g. com.example.myapp"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Find it at:{" "}
            <span className="font-mono">
              play.google.com/store/apps/details?id=YOUR_PACKAGE_ID
            </span>
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isLoading || !appId.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}