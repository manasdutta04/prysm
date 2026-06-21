"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Blocks,
  Database,
  History,
  HelpCircle,
  BookOpen,
  GalleryVerticalEnd,
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
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
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
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Connect Apps",
      url: "/connect-apps",
      icon: Blocks,
    },
    {
      title: "Custom Data",
      url: "/custom-data",
      icon: Database,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
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
  const baseLinkClass = "glass-nav-item";
  const activeClass = "active";

  const currentUser = {
    name: authUser?.fullName || "Guest",
    email: authUser?.email || "",
    avatar: authUser?.profilePic || "",
  };

  return (
    <Sidebar collapsible="none" className="w-64 shrink-0 premium-glass-sidebar" {...props}>
      <SidebarHeader className="px-6 py-4 flex flex-row items-center gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10 transition-transform duration-300 hover:scale-[1.02]">
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
        <div className="flex-1" />
        <SidebarGroup className="px-0 py-2 border-t border-white/5">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/help-support" className={`${baseLinkClass} ${isHelpActive ? activeClass : ""}`}>
                <HelpCircle size={18} className="lucide" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/docs" className={`${baseLinkClass} ${isDocsActive ? activeClass : ""}`}>
                <BookOpen size={18} className="lucide" />
                <span>Documentation</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
