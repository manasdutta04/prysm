import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

import DashboardPage from "./pages/dashboard";
import ConnectAppsPage from "./pages/connect-apps";
import CustomDataPage from "./pages/custom-data";
import HistoryPage from "./pages/history";
import HelpSupportPage from "./pages/help-support";
import DocsPage from "./pages/docs";

import Register from "./pages/Register";
import Login from "./pages/Login";

import { useAuthStore } from "./store/useAuthStore";

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
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "Borel, cursive" }}
                >
                  prysm
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
                <Routes>
                  <Route
                    path="/"
                    element={
                      authUser ? <DashboardPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      authUser ? <DashboardPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/connect-apps"
                    element={
                      authUser ? <ConnectAppsPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/custom-data"
                    element={
                      authUser ? <CustomDataPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      authUser ? <HistoryPage /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="/help-support" element={<HelpSupportPage />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route
                    path="/register"
                    element={!authUser ? <Register /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/login"
                    element={!authUser ? <Login /> : <Navigate to="/" />}
                  />

                  {/* without authentication version */}
                  {/* <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/connect-apps" element={<ConnectAppsPage />} />
                <Route path="/custom-data" element={<CustomDataPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/help-support" element={<HelpSupportPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />*/}
                </Routes>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
export default App;
