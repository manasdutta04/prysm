import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/login";
import TermsPage from "./pages/terms";
import PrivacyPage from "./pages/privacy";
import DashboardPage from "./pages/dashboard";
import DemoDashboardPage from "./pages/demo";
import ConnectAppsPage from "./pages/connect-apps";
import CustomDataPage from "./pages/custom-data";
import HistoryPage from "./pages/history";
import HelpSupportPage from "./pages/help-support";
import DocsPage from "./pages/docs";
import SettingsPage from "./pages/settings";
import AccountPage from "./pages/account";
import { NotificationModal } from "./components/notification-modal";
import NotFoundPage from "./components/ui/404-page-not-found";

import { useAuthStore } from "./store/useAuthStore";
import { useNotificationStore } from "./store/useNotificationStore";

function PrivateLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <SidebarInset
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                padding: "2rem",
              }}
            >
              {children || <Outlet />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

function HamsterLoader() {
  return (
    <div className="prysm-loader-container">
      <div
        aria-label="Orange and tan hamster running in a metal wheel"
        role="img"
        className="wheel-and-hamster"
      >
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return <HamsterLoader />;
  }
  return authUser ? children : <Navigate to="/" replace />;
}

function HomeRoute() {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return <HamsterLoader />;
  }
  return authUser ? (
    <PrivateLayout>
      <DashboardPage />
    </PrivateLayout>
  ) : (
    <LandingPage />
  );
}

function LoginPageWrapper() {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return <HamsterLoader />;
  }
  return authUser ? <Navigate to="/" replace /> : <LoginPage />;
}

function App() {
  const { authUser, checkAuth } = useAuthStore();
  const { loadNotifications } = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      loadNotifications();
    }
  }, [authUser, loadNotifications]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(30, 30, 30, 0.95)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <NotificationModal />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/docs" element={<DocsPage />} />

        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/connect-apps" element={<ConnectAppsPage />} />
          <Route path="/custom-data" element={<CustomDataPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/help-support" element={<HelpSupportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route
          path="/demo"
          element={
            <PrivateLayout>
              <DemoDashboardPage />
            </PrivateLayout>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
