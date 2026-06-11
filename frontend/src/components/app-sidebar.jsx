"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LifeBuoy,
  FileText,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { useLocation, Link } from "react-router-dom"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore"

// This is sample data.
const data = {
  teams: [
    {
      name: "Nexus Inc",
      logo: GalleryVerticalEnd,
      plan: "Free Plan",
    },
    {
      name: "Civic Corp.",
      logo: GalleryVerticalEnd,
      plan: "Free Plan",
    },
    {
      name: "Evil Corp.",
      logo: GalleryVerticalEnd,
      plan: "Free Plan",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Connect Apps",
      url: "/connect-apps",
      icon: Bot,
    },
    {
      title: "Custom Data",
      url: "/custom-data",
      icon: BookOpen,
    },
    {
      title: "History",
      url: "/history",
      icon: Settings2,
    },
  ],
  projects: [],
}

// ...existing code...
export function AppSidebar(props) {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const isHelpActive = location.pathname === "/help-support";
  const isDocsActive = location.pathname === "/docs";
  const baseLinkClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors";
  const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";

  const currentUser = {
    name: authUser?.fullName || "Guest",
    email: authUser?.email || "",
    avatar: authUser?.profilePic || "",
  };

  return (
    <Sidebar collapsible="none" className="w-64 shrink-0" {...props}>
      <SidebarHeader className="px-6 py-4 flex flex-row items-center gap-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img
            src="/prysm-logo.png"
            alt="Prysm Logo"
            className="h-8 w-auto object-contain"
          />
          <span
            className="font-normal text-white tracking-tight text-2xl italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Prysm
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <div className="flex flex-col gap-1 px-2 py-2 text-sm">
        <Link to="/help-support" className={`${baseLinkClass} ${isHelpActive ? activeClass : ""}`}>
          <LifeBuoy size={18} className="lucide" />
          <span>Help & Support</span>
        </Link>
        <Link to="/docs" className={`${baseLinkClass} ${isDocsActive ? activeClass : ""}`}>
          <FileText size={18} className="lucide" />
          <span>Documentation</span>
        </Link>
      </div>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
