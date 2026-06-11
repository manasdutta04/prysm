import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/login";
import TermsPage from "./pages/terms";
import PrivacyPage from "./pages/privacy";
import DashboardPage from "./pages/dashboard";
import ConnectAppsPage from "./pages/connect-apps";
import CustomDataPage from "./pages/custom-data";
import HistoryPage from "./pages/history";
import HelpSupportPage from "./pages/help-support";
import DocsPage from "./pages/docs";
import SettingsPage from "./pages/settings";
import AccountPage from "./pages/account";

import { useAuthStore } from "./store/useAuthStore";

function PrivateLayout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
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
            <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
              <div></div>
            </header>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Outlet />
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
      <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
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
  return authUser ? children : <Navigate to="/login" replace />;
}

function LoginPageWrapper() {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return <HamsterLoader />;
  }
  return authUser ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

function App() {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<LoginPageWrapper />}
        />
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/connect-apps" element={<ConnectAppsPage />} />
          <Route path="/custom-data" element={<CustomDataPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/help-support" element={<HelpSupportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<Navigate to={authUser ? "/dashboard" : "/"} replace />} />
      </Routes>
    </>
  );
}

export default App;
