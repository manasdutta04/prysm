
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  const location = useLocation();
  return (
    <SidebarGroup className="px-0 py-2">
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <SidebarMenuItem key={item.title}>
              <Link
                to={item.url}
                className={`glass-nav-item ${isActive ? "active" : ""}`}
              >
                {item.icon && <item.icon size={18} />}
                <span className="font-medium tracking-wide">{item.title}</span>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
