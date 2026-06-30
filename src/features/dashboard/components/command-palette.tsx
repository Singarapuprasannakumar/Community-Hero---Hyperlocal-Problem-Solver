import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Settings,
  LayoutDashboard,
  AlertCircle,
  MapPin,
  PieChart,
  ShieldAlert,
  LogOut,
  Sparkles
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "sonner";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = (action: () => void) => {
    action();
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard Overview</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard/issues" }))}>
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Issues List</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard/map" }))}>
            <MapPin className="mr-2 h-4 w-4" />
            <span>Living Map</span>
          </CommandItem>
          {(user?.role === "officer" || user?.role === "manager" || user?.role === "admin") && (
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard/analytics" }))}>
              <PieChart className="mr-2 h-4 w-4" />
              <span>Department Analytics</span>
            </CommandItem>
          )}
          {(user?.role === "manager" || user?.role === "admin") && (
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard/admin" }))}>
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Admin Operations</span>
            </CommandItem>
          )}
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard/settings" }))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings & Preferences</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions & System">
          <CommandItem onSelect={() => runCommand(() => {
            toast.success("Action Triggered: Create New Report");
          })}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Report New Issue</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(toggleSidebar)}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Toggle Sidebar</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(logout)}>
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Logout Session</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
