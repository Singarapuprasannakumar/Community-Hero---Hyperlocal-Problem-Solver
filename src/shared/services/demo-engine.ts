import { useDemoStore } from "../stores/demo-store";
import { useDiagnosticsStore } from "../stores/diagnostics-store";
import { useVolunteerStore, useEventStore } from "../stores/community-store";
import { useIssueStore } from "../stores/issue-store";
import { demoScenarios } from "./demo-scenarios";
// Deterministic PRNG for tests
let __demoSeed = 12345;
function __demoRandom() {
  __demoSeed = (__demoSeed * 16807) % 2147483647;
  return __demoSeed / 2147483647;
}
import { toast } from "sonner";

let demoInterval: any = null;

export const demoEngine = {
  start() {
    if (typeof window === "undefined") return;
    if (demoInterval) clearInterval(demoInterval);

    const { speedMultiplier, incrementMetric } = useDemoStore.getState();
    const intervalMs = 10000 / speedMultiplier; // Base interval 10 seconds divided by speed multiplier

    toast.success(`Demo Mode Ticker started at x${speedMultiplier} speed.`);

    demoInterval = setInterval(() => {
      const { isDemoMode, currentScenario } = useDemoStore.getState();
      if (!isDemoMode) {
        this.stop();
        return;
      }

      // If playing story mode, don't trigger random incidents
      if (currentScenario === "story") return;

      // Random event distribution
      const rand = __demoRandom();
      const { addLog } = useDiagnosticsStore.getState();

      if (rand < 0.25) {
        // Trigger random road/waste report
        const categories = ["Roads & Transit", "Sanitation", "Water Supply", "Hazards & Safety"];
        const chosen = categories[Math.floor(__demoRandom() * categories.length)];
        toast.info(`Simulating citizen file upload: New ${chosen} complaint...`);
        
        const title = `Simulated report: ${chosen} alert`;
        const iss = demoScenarios.createMockIssue(title, chosen, chosen, 12.970 + (Math.random() - 0.5) * 0.05, 77.610 + (Math.random() - 0.5) * 0.05);
        
        const { createIssue } = useIssueStore.getState();
        createIssue(iss);

        incrementMetric("issuesCreated");
        incrementMetric("eventsGenerated");
        
        addLog({
          category: "Application",
          message: `Citizen filed complaint ${iss.id.substring(0, 6)}`,
          type: "info"
        });
      } else if (rand < 0.50) {
        // Increment volunteer activity
        const { volunteers } = useVolunteerStore.getState();
        if (volunteers.length > 0) {
          const idx = Math.floor(__demoRandom() * volunteers.length);
          const vol = volunteers[idx];
          vol.volunteerHours += 1;
          incrementMetric("volunteersActivated");
          incrementMetric("eventsGenerated");
          
          addLog({
            category: "Offline",
            message: `Volunteer ${vol.name} clocked 1 hour of field activity`,
            type: "info"
          });
        }
      } else if (rand < 0.75) {
        // Simulate API diagnostic latencies
        const ms = Math.round(__demoRandom() * 60 + 15);
        addLog({
          category: "Performance",
          message: `Copilot API Response resolved in ${ms}ms`,
          type: "info"
        });
      } else {
        // Ticks event registrations
        const { events, registerForEvent } = useEventStore.getState();
        if (events.length > 0) {
          const idx = Math.floor(__demoRandom() * events.length);
          const evt = events[idx];
          registerForEvent(evt.id);
          incrementMetric("eventsGenerated");
          
          addLog({
            category: "Application",
            message: `New attendee check-in registered for: ${evt.title}`,
            type: "info"
          });
        }
      }
    }, intervalMs);
  },

  stop() {
    if (demoInterval) {
      clearInterval(demoInterval);
      demoInterval = null;
      toast.info("Demo Mode Ticker paused.");
    }
  }
};
