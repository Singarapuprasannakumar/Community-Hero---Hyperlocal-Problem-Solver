import { useEventStore, useGamificationStore } from "@/shared/stores/community-store";
import { Calendar, Users, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EventsBoard() {
  const { events, registerForEvent } = useEventStore();
  const { addXP, unlockBadge } = useGamificationStore();
  const [registered, setRegistered] = useState<string[]>([]);

  const handleRegister = (eventId: string, title: string) => {
    if (registered.includes(eventId)) {
      toast.info("You are already registered for this civic event.");
      return;
    }

    registerForEvent(eventId);
    setRegistered([...registered, eventId]);
    
    // Add XP and unlock community badge
    addXP(150);
    unlockBadge("Civic Activist");
    toast.success(`Registered for ${title}! +150 XP. Badge Unlocked: 'Civic Activist'`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Cleanup Campaigns & Drives</h2>
        <p className="text-xs text-muted-foreground mt-1">Coordinate cleaning projects and sapling plantations with neighbors.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((evt) => {
          const isReg = registered.includes(evt.id);
          return (
            <div key={evt.id} className="rounded-3xl border border-border bg-card p-5 shadow-soft hover:border-primary/25 transition-all space-y-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase bg-secondary/50 px-2 py-0.5 rounded-lg">
                  <Calendar className="h-3 w-3" />
                  {new Date(evt.eventDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <h4 className="font-bold text-sm text-foreground mt-2">{evt.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{evt.description}</p>
              </div>

              <div className="space-y-2.5 text-xs border-t border-border/60 pt-3">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{evt.locationAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{evt.registrantCount} Registered ({evt.volunteersNeeded} slots total)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                {isReg ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-4 py-2 text-xs font-semibold text-success">
                    <Check className="h-3.5 w-3.5" />
                    <span>Registered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(evt.id, evt.title)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all"
                  >
                    Register Drive
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default EventsBoard;
