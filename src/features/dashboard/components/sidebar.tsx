import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  AlertCircle,
  MapPin,
  Users,
  Settings,
  ShieldAlert,
  PieChart,
  Heart,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: any;
  label: string;
  to: string;
  allowedRoles?: string[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
  { icon: AlertCircle, label: "Issues List", to: "/dashboard/issues" },
  { icon: MapPin, label: "Living Map", to: "/dashboard/map" },
  { icon: Users, label: "Community Ops", to: "/dashboard/community" },
  { icon: PieChart, label: "Executive Intel", to: "/dashboard/analytics", allowedRoles: ["officer", "manager", "admin"] },
  { icon: ShieldAlert, label: "Operations Center", to: "/dashboard/admin", allowedRoles: ["manager", "admin"] },
  { icon: Heart, label: "System Health", to: "/dashboard/diagnostics" },
  { icon: Settings, label: "Settings", to: "/dashboard/settings" },
];

export function Sidebar({ className }: { className?: string }) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const allowedItems = SIDEBAR_ITEMS.filter(
    (item) => !item.allowedRoles || (user && item.allowedRoles.includes(user.role))
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/85 backdrop-blur-md transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!sidebarCollapsed ? (
          <Logo />
        ) : (
          <Link to="/" className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl shadow-glow" style={{ background: "var(--gradient-brand)" }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary lg:flex"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1.5 px-3 py-4" aria-label="Dashboard navigation">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-full ml-4 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / User section */}
      <div className="border-t border-border p-4">
        {user && !sidebarCollapsed && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-secondary/50 p-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-white shadow-soft">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold leading-none">{user.name}</p>
              <p className="mt-1 truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
            sidebarCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
