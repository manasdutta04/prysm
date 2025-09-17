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
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Manas Dutta",
    email: "manas@prysm.io",
    avatar: "/avatars/shadcn.jpg",
  },
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
  const isHelpActive = location.pathname === "/help-support";
  const isDocsActive = location.pathname === "/docs";
  const baseLinkClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors";
  const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
