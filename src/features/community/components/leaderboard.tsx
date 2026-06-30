import { useGamificationStore, useLeaderboardStore, useReputationStore } from "@/shared/stores/community-store";
import { Award, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const { xp, level, badges } = useGamificationStore();
  const { rankings } = useLeaderboardStore();
  const { reputation } = useReputationStore();

  const dailyMissions = [
    { id: "mis-1", name: "Verify 1 incident in Ward 80", xp: 50, done: true },
    { id: "mis-2", name: "Add 1 comment to RWA Cleanup event", xp: 30, done: false },
    { id: "mis-3", name: "Confirm duplicate check coordinates", xp: 40, done: false },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.3fr]">
      {/* Left side: Personal stats, badges, and daily challenges */}
      <div className="space-y-5">
        {/* Profile Card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-white uppercase">
              ME
            </div>
            <div>
              <div className="text-xs font-semibold">Active Citizen Profile</div>
              <div className="text-[10px] text-muted-foreground">Trust Index: {reputation.trustScore}%</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold">
              <span>Level {level} Explorer</span>
              <span className="text-muted-foreground">{xp % 500} / 500 XP</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${((xp % 500) / 500) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Zap className="h-4 w-4 text-warning" />
            <span>Daily Missions</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            {dailyMissions.map((mis) => (
              <div key={mis.id} className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className={cn(mis.done ? "line-through text-muted-foreground" : "text-foreground font-medium")}>
                  {mis.name}
                </span>
                <span className="font-semibold text-primary">+{mis.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Award className="h-4 w-4 text-primary" />
            <span>Earned Badges ({badges.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {badges.map((bdg) => (
              <div key={bdg} className="flex items-center gap-2 rounded-xl border border-border bg-secondary/20 p-2.5 font-semibold text-foreground">
                <Trophy className="h-3.5 w-3.5 text-warning shrink-0" />
                <span className="truncate">{bdg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Global Citizen Leaderboards */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
          <Trophy className="h-4.5 w-4.5 text-primary animate-bounce" />
          <span>Municipal Citizen Leaderboard</span>
        </h3>
        <div className="space-y-2">
          {rankings.map((rank) => (
            <div key={rank.userId} className="flex items-center justify-between border border-border/80 bg-secondary/15 hover:bg-secondary/30 p-3 rounded-2xl transition-all text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-muted-foreground font-mono w-4">#{rank.rank}</span>
                <span className="font-semibold">{rank.name}</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-[10px] text-muted-foreground">Trust: {rank.trustScore}%</span>
                <span className="text-primary">{rank.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Leaderboard;
