import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Header } from "@/features/dashboard/components/header";
import { CommandPalette } from "@/features/dashboard/components/command-palette";
import { NotificationsPanel } from "@/features/dashboard/components/notifications-panel";
import { AICopilot } from "@/features/ai/components/ai-copilot";
import { DemoPresenterBar } from "@/features/diagnostics/components/demo-presenter-bar";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/shared/functions/auth-rpc";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    // This executes on both client and server.
    // On the server, getAuthSession reads the HTTP-only cookie.
    // On the client, it fetches via an RPC call if necessary.
    const { isAuthenticated, user } = await getAuthSession();
    
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // Sync client state if running on the client
    if (typeof window !== "undefined" && user) {
      useAuthStore.getState().login(user);
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col transition-all duration-300 min-h-screen",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <NotificationsPanel />
      <AICopilot />
      <DemoPresenterBar />
    </div>
  );
}