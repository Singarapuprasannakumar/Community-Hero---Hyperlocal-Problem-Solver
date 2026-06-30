import { Link } from "@tanstack/react-router";
import { Search, Bell, Sparkles, User, Settings, LogOut, ChevronDown, CalendarDays, Menu } from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useWorkspaceStore } from "@/shared/stores/workspace-store";
import { useNotificationStore } from "@/shared/stores/notification-store";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Header() {
  const { setCommandPaletteOpen, setNotificationDrawerOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace, getActiveWorkspace } = useWorkspaceStore();
  const { getUnreadCount } = useNotificationStore();

  const currentWorkspace = getActiveWorkspace();
  const unreadCount = getUnreadCount();

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md">
      {/* Left side: Mobile menu & Workspace selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Workspace Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition-all">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {currentWorkspace?.name || "Select Ward"}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">
                Change Ward/District
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws.id);
                    toast.success(`Switched ward to ${ws.name}`);
                  }}
                  className={cn(
                    "flex items-center justify-between text-xs py-2",
                    ws.id === activeWorkspaceId ? "font-semibold bg-secondary" : ""
                  )}
                >
                  {ws.name}
                  {ws.id === activeWorkspaceId && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Right side: Actions, Theme, Notif, Profile */}
      <div className="flex items-center gap-2">
        {/* Date Display */}
        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex mr-2">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{currentDate}</span>
        </div>

        {/* Search Input trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
          title="Search (Ctrl + K)"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Quick Report Issue Button */}
        <Link
          to="/dashboard/issues/create"
          className="hidden items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all sm:inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Report Issue</span>
        </Link>

        <ThemeToggle />

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <span className="text-xs font-bold text-white uppercase">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col py-1.5">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground truncate">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="flex w-full items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="flex w-full items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
