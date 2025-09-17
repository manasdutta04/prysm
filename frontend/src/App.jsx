

import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

import DashboardPage from "./pages/dashboard"
import ConnectAppsPage from "./pages/connect-apps"
import CustomDataPage from "./pages/custom-data"
import HistoryPage from "./pages/history"
import HelpSupportPage from "./pages/help-support"
import DocsPage from "./pages/docs"



function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SidebarProvider>
        <AppSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Borel, cursive' }}>
                prysm
              </div>
              <div></div>
            </header>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/connect-apps" element={<ConnectAppsPage />} />
                <Route path="/custom-data" element={<CustomDataPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/help-support" element={<HelpSupportPage />} />
                <Route path="/docs" element={<DocsPage />} />
              </Routes>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default App
