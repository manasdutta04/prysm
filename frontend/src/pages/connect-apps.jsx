import React, { useState, useEffect } from "react";
import "./connect-apps.css";
import { AppStoreConnectModal } from "@/components/app-store-connect-modal";
import { PlaystoreConnectModal } from "@/components/playstore-connect-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { usePlaystoreStore } from "../store/usePlaystoreStore";

export default function ConnectAppsPage() {
  const [connectedApps, setConnectedApps] = useState(() => {
    const saved = localStorage.getItem("connectedApps");
    return saved ? JSON.parse(saved) : {};
  });

  const [isAppStoreModalOpen, setIsAppStoreModalOpen] = useState(false);
  const [isPlaystoreModalOpen, setIsPlaystoreModalOpen] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState({
    isOpen: false,
    appName: null,
  });
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Playstore store
  const {
    isConnected: playstoreConnected,
    appName: playstoreAppName,
    isFetching,
    checkStatus,
    disconnect: disconnectPlaystore,
    fetchReviews,
  } = usePlaystoreStore();

  // Check Play Store connection status on page load
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Sync Play Store status into connectedApps state
  useEffect(() => {
    if (playstoreConnected && playstoreAppName) {
      setConnectedApps((prev) => ({
        ...prev,
        "Play Store": {
          isConnected: true,
          appName: playstoreAppName,
          appIcon: null,
          lastSync: Date.now(),
        },
      }));
    } else if (!playstoreConnected) {
      setConnectedApps((prev) => {
        const updated = { ...prev };
        delete updated["Play Store"];
        return updated;
      });
    }
  }, [playstoreConnected, playstoreAppName]);

  React.useEffect(() => {
    localStorage.setItem("connectedApps", JSON.stringify(connectedApps));
  }, [connectedApps]);

  const apps = [
    {
      name: "Gmail",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      description: "Connect your Gmail account",
    },
    {
      name: "X",
      logo: "https://static.vecteezy.com/system/resources/previews/027/714/631/non_2x/twitter-new-logo-twitter-icons-twitter-x-logo-free-png.png",
      description: "Connect your X account",
    },
    {
      name: "Play Store",
      logo: "https://cdn.freebiesupply.com/logos/large/2x/google-play-store-logo-png-transparent.png",
      description: "Connect your Google Play Store",
    },
    {
      name: "App Store",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg",
      description: "Connect your Apple App Store",
    },
  ];

  const handleConnectClick = (appName) => {
    if (appName === "App Store") {
      setIsAppStoreModalOpen(true);
    } else if (appName === "Play Store") {
      setIsPlaystoreModalOpen(true);
    } else {
      toast("Integration coming soon!", { icon: "🚧" });
    }
  };

  const handleAppStoreConnected = (appData) => {
    setConnectedApps((prev) => ({
      ...prev,
      "App Store": {
        isConnected: true,
        appName: appData.name,
        appIcon: appData.icon,
        lastSync: Date.now(),
      },
    }));
  };

  const handlePlaystoreConnected = (appData) => {
    setConnectedApps((prev) => ({
      ...prev,
      "Play Store": {
        isConnected: true,
        appName: appData.appId,
        appIcon: null,
        lastSync: Date.now(),
      },
    }));
  };

  const handleDisconnectClick = (appName) => {
    setDisconnectModal({ isOpen: true, appName });
  };

  const confirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      if (disconnectModal.appName === "Play Store") {
        await disconnectPlaystore();
      } else {
        // Mock for other apps
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setConnectedApps((prev) => {
          const newState = { ...prev };
          delete newState[disconnectModal.appName];
          return newState;
        });
        toast.success(
          `Disconnected — ${
            connectedApps[disconnectModal.appName]?.appName ||
            disconnectModal.appName
          }`
        );
      }
      setDisconnectModal({ isOpen: false, appName: null });
    } catch (error) {
      toast.error("Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="connect-apps-page">
      <div className="page-header">
        <h1 className="page-title">Connect Apps</h1>
        <p className="page-subtitle">
          Connect your apps to sync data seamlessly
        </p>
      </div>

      <div className="connect-apps-grid">
        {apps.map((app, index) => {
          const isConnected = connectedApps[app.name]?.isConnected;
          const connectedData = connectedApps[app.name];

          return (
            <div key={index} className="app-card">
              <div className="app-logo">
                <img src={app.logo} alt={`${app.name} logo`} />
              </div>

              <div className="app-info">
                <h3 className="app-name">{app.name}</h3>
                <p className="app-description">{app.description}</p>

                {isConnected && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                      {connectedData.appIcon ? (
                        <img
                          src={connectedData.appIcon}
                          alt={connectedData.appName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {connectedData.appName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {connectedData.appName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Synced: {formatTime(connectedData.lastSync)}
                      </p>
                    </div>
                    <div
                      className="h-2 w-2 rounded-full bg-green-500 shrink-0"
                      title="Connected"
                    />
                  </div>
                )}
              </div>

              {isConnected ? (
                <div className="flex flex-col gap-2 w-full mt-4">
                  {/* Fetch Reviews button — only for Play Store */}
                  {app.name === "Play Store" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={fetchReviews}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        "Fetch Reviews"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDisconnectClick(app.name)}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <button
                  className="connect-button"
                  onClick={() => handleConnectClick(app.name)}
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* App Store Modal — unchanged */}
      <AppStoreConnectModal
        isOpen={isAppStoreModalOpen}
        onClose={() => setIsAppStoreModalOpen(false)}
        onConnect={handleAppStoreConnected}
      />

      {/* Play Store Modal — new */}
      <PlaystoreConnectModal
        isOpen={isPlaystoreModalOpen}
        onClose={() => setIsPlaystoreModalOpen(false)}
        onConnect={handlePlaystoreConnected}
      />

      {/* Disconnect confirmation dialog — unchanged */}
      <Dialog
        open={disconnectModal.isOpen}
        onOpenChange={(open) =>
          !isDisconnecting && setDisconnectModal({ isOpen: open, appName: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {disconnectModal.appName}?</DialogTitle>
            <DialogDescription>
              Disconnecting will stop scheduled imports for{" "}
              {connectedApps[disconnectModal.appName]?.appName}.
              Historical data will remain archived.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() =>
                setDisconnectModal({ isOpen: false, appName: null })
              }
              disabled={isDisconnecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}