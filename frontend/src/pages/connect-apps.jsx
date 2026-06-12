import React, { useState, useEffect } from "react";
import "./connect-apps.css";
import { AppStoreConnectModal } from "@/components/app-store-connect-modal";
import { PlaystoreConnectModal } from "@/components/playstore-connect-modal";
import { XConnectModal } from "@/components/x-connect-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";
import toast from "react-hot-toast";
import { Loader2, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlaystoreStore } from "../store/usePlaystoreStore";
import { useNotificationStore } from "../store/useNotificationStore";

export default function ConnectAppsPage() {
  const [connectedApps, setConnectedApps] = useState(() => {
    const saved = localStorage.getItem("connectedApps");
    return saved ? JSON.parse(saved) : {};
  });

  const [isAppStoreModalOpen, setIsAppStoreModalOpen] = useState(false);
  const [isPlaystoreModalOpen, setIsPlaystoreModalOpen] = useState(false);
  const [isXModalOpen, setIsXModalOpen] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState({
    isOpen: false,
    appName: null,
  });
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const { addNotification } = useNotificationStore();

  // Playstore store
  const {
    isConnected: playstoreConnected,
    appName: playstoreAppName,
    appId: playstoreAppId,
    checkStatus,
    disconnect: disconnectPlaystore,
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
          appId: playstoreAppId,
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
  }, [playstoreConnected, playstoreAppName, playstoreAppId]);

  React.useEffect(() => {
    localStorage.setItem("connectedApps", JSON.stringify(connectedApps));
  }, [connectedApps]);

  const apps = [
    {
      name: "Gmail",
      icon: <img src="/gmail.svg" className="w-full h-full object-contain" alt="Gmail" />,
      description: "Connect your Gmail account",
    },
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      description: "Connect your X account",
    },
    {
      name: "Play Store",
      icon: <img src="/playstore.svg" className="w-full h-full object-contain" alt="Play Store" />,
      description: "Connect your Google Play Store",
    },
    {
      name: "App Store",
      icon: <img src="/appstore.svg" className="w-full h-full object-contain brightness-0 invert" alt="App Store" />,
      description: "Connect your Apple App Store",
    },
  ];

  const handleConnectClick = (appName) => {
    if (appName === "Gmail") {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      window.location.href = `${apiBase}/auth/google/connect`;
    } else if (appName === "App Store") {
      setIsAppStoreModalOpen(true);
    } else if (appName === "Play Store") {
      setIsPlaystoreModalOpen(true);
    } else if (appName === "X") {
      setIsXModalOpen(true);
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
        appId: appData.id,
        lastSync: Date.now(),
      },
    }));
    addNotification({
      title: "App Store Connected",
      description: `Successfully linked App Store app: "${appData.name}" (ID: ${appData.id}).`,
      category: "system"
    });
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
    addNotification({
      title: "Play Store Connected",
      description: `Successfully linked Play Store app package ID: "${appData.appId}".`,
      category: "system"
    });
  };

  const handleXConnected = (appData) => {
    setConnectedApps((prev) => ({
      ...prev,
      X: {
        isConnected: true,
        appName: appData.name,
        appIcon: appData.icon,
        lastSync: Date.now(),
      },
    }));
    addNotification({
      title: "X Account Tracked",
      description: `Successfully linked handle: "@${appData.name}". Social feedback is queued for sync.`,
      category: "system"
    });
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
      toast.error("Failed to disconnect", error);
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
      <div className="connect-apps-grid">
        {apps.map((app, index) => {
          const isConnected = connectedApps[app.name]?.isConnected;
          const connectedData = connectedApps[app.name];

          return (
            <div key={index} className={`app-card ${isConnected ? "connected" : ""}`}>
              <div className="app-card-header">
                <div className="app-logo">
                  {app.icon}
                </div>
                <div className="app-title-group">
                  <h3 className="app-name">{app.name === "X" ? "X (Twitter)" : app.name}</h3>
                  <span className={`status-badge ${isConnected ? "badge-connected" : "badge-disconnected"}`}>
                    {isConnected ? "Connected" : "Available"}
                  </span>
                </div>
              </div>

              <div className="app-info">
                <p className="app-description">{app.description}</p>

                {isConnected && (
                  <div className="connected-status">
                    <div className="status-avatar">
                      {connectedData.appIcon ? (
                        <img
                          src={connectedData.appIcon}
                          alt={connectedData.appName}
                        />
                      ) : (
                        <span className="status-initial">
                          {connectedData.appName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="status-details">
                      <p className="status-name">{connectedData.appName}</p>
                      <p className="status-sync">
                        Synced: {formatTime(connectedData.lastSync)}
                      </p>
                    </div>
                    <div className="status-dot" title="Connected" />
                  </div>
                )}
              </div>

              {isConnected ? (
                <div className="app-card-actions">
                  <LiquidButton
                    variant="destructive"
                    className="w-full text-white font-semibold rounded-xl"
                    onClick={() => handleDisconnectClick(app.name)}
                    size="lg"
                  >
                    Disconnect
                  </LiquidButton>
                </div>
              ) : (
                <div className="app-card-actions">
                  <LiquidButton
                    className="w-full text-white font-bold tracking-wide rounded-xl border-none"
                    variant="default"
                    onClick={() => handleConnectClick(app.name)}
                    size="lg"
                  >
                    Connect
                  </LiquidButton>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* App Store Modal */}
      <AppStoreConnectModal
        isOpen={isAppStoreModalOpen}
        onClose={() => setIsAppStoreModalOpen(false)}
        onConnect={handleAppStoreConnected}
      />

      {/* Play Store Modal */}
      <PlaystoreConnectModal
        isOpen={isPlaystoreModalOpen}
        onClose={() => setIsPlaystoreModalOpen(false)}
        onConnect={handlePlaystoreConnected}
      />

      {/* X Modal */}
      <XConnectModal
        isOpen={isXModalOpen}
        onClose={() => setIsXModalOpen(false)}
        onConnect={handleXConnected}
      />

      {/* Disconnect confirmation dialog */}
      <Dialog
        open={disconnectModal.isOpen}
        onOpenChange={(open) =>
          !isDisconnecting &&
          setDisconnectModal({ isOpen: open, appName: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {disconnectModal.appName}?</DialogTitle>
            <DialogDescription>
              Disconnecting will stop scheduled imports for{" "}
              {connectedApps[disconnectModal.appName]?.appName}. Historical data
              will remain archived.
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

      {/* Integration Setup Guide */}
      <div className="setup-guide-section">
        <div className="guide-header" onClick={() => setIsGuideOpen(!isGuideOpen)}>
          <div className="guide-header-title">
            <HelpCircle className="guide-icon" size={18} />
            <h3>Integration Setup Guide</h3>
          </div>
          <div className="guide-header-actions">
            <Link to="/docs" className="docs-link flex-align gap-05" onClick={(e) => e.stopPropagation()}>
              <span>Full Documentation</span>
              <ExternalLink size={12} />
            </Link>
            <button className="guide-toggle-btn">
              {isGuideOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {isGuideOpen && (
          <div className="guide-content">
            <div className="guide-grid">
              <div className="guide-card">
                <h4>Gmail</h4>
                <p>Click <strong>Connect</strong> to authorize Google OAuth. Once approved, Prysm securely imports feedback directly from your Gmail inbox.</p>
              </div>

              <div className="guide-card">
                <h4>X (Twitter)</h4>
                <p>Enter any public X user handle. Prysm scrapes posts via public RSS endpoints to track mentions and social feedback.</p>
              </div>

              <div className="guide-card">
                <h4>Google Play Store</h4>
                <p>Provide your Android app package ID (e.g. <code>com.example.app</code>). Use the <strong>Fetch Reviews</strong> action on the card to sync reviews manually.</p>
              </div>

              <div className="guide-card">
                <h4>Apple App Store</h4>
                <p>Search for your iOS app name or enter its iTunes numerical ID. Reviews are scraped automatically during dashboard updates (up to 10 pages per fetch).</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}