import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useNotificationStore } from "@/store/useNotificationStore"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { notifications, setModalOpen } = useNotificationStore()
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="glass-profile-card flex w-full items-center gap-3 text-left text-sm text-sidebar-foreground cursor-pointer focus:outline-none"
              style={{ margin: 0 }}
            >
              <Avatar className="h-9 w-9 rounded-lg avatar-glow">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg" name={user.name} />
              </Avatar>
              <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white/95">{user.name}</span>
                <span className="truncate text-xs text-white/40">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-white/40" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-lg avatar-glow">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg" name={user.name} />
                </Avatar>
                <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/account")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModalOpen(true)}>
                <Bell />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span 
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      height: "1rem",
                      width: "1rem",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9999px",
                      background: "#CCFF00",
                      fontSize: "9px",
                      fontWeight: "bold",
                      color: "#000000",
                      fontFamily: "monospace"
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/demo")}>
                <Sparkles />
                <span>Try Demo</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
