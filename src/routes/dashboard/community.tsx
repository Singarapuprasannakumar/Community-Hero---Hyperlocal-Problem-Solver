import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Trophy, Megaphone, MessageSquare, Calendar } from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { SocialFeed } from "@/features/community/components/social-feed";
import { Leaderboard } from "@/features/community/components/leaderboard";
import { EventsBoard } from "@/features/community/components/events-board";
import { MessagingBoard } from "@/features/community/components/messaging-board";
import { Reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/community")({
  head: () => ({
    meta: [
      { title: "Community Operations — Community Hero AI" },
    ],
  }),
  component: CommunityCollabPage,
});

type TabType = "feed" | "events" | "leaderboard" | "messaging";

function CommunityCollabPage() {
  const { setBreadcrumbs } = useUIStore();
  const [activeTab, setActiveTab] = useState<TabType>("feed");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Community Operations" },
    ]);
  }, [setBreadcrumbs]);

  const tabsConfig = [
    { id: "feed" as TabType, name: "Operational Feed", icon: Megaphone },
    { id: "events" as TabType, name: "Cleanup Campaigns", icon: Calendar },
    { id: "leaderboard" as TabType, name: "Leaderboard & XP", icon: Trophy },
    { id: "messaging" as TabType, name: "Messaging Center", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Operations Center</h1>
            <p className="text-sm text-muted-foreground">Collaborate on cleanups, check rankings, and coordinate dispatches with local RWAs.</p>
          </div>
        </div>
      </Reveal>

      {/* Tabs navigation */}
      <Reveal>
        <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all hover:bg-secondary",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Tab panel rendering */}
      <Reveal>
        <div className="mt-4">
          {activeTab === "feed" && <SocialFeed />}
          {activeTab === "events" && <EventsBoard />}
          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "messaging" && <MessagingBoard />}
        </div>
      </Reveal>
    </div>
  );
}
export default CommunityCollabPage;
