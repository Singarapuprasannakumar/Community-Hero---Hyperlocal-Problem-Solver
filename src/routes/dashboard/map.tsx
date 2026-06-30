import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Navigation, Sparkles, AlertTriangle, TrendingUp, Building2, Info } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { useUIStore } from "@/shared/stores/ui-store";
import { useGISStore } from "@/shared/stores/gis-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { MapLoader } from "@/features/gis/components/map-loader";
import { MapControls } from "@/features/gis/components/map-controls";
import { RouteEngine } from "@/features/gis/components/route-engine";
import { TimelinePlayback } from "@/features/gis/components/timeline-playback";
import { routingService, gisAnalyticsService } from "@/shared/services/gis-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/map")({
  head: () => ({
    meta: [
      { title: "Digital Twin Ops — Community Hero AI" },
    ],
  }),
  component: DigitalTwinMapPage,
});

function DigitalTwinMapPage() {
  const { setBreadcrumbs } = useUIStore();
  const { selectedMapIssueId, activeRoute, setActiveRoute, setSelectedMapIssueId } = useGISStore();
  const { issues, initializeDatabase } = useIssueStore();

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    initializeDatabase();
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Digital Twin Console" },
    ]);
    setAnalytics(gisAnalyticsService.getSpatialStats());
  }, [setBreadcrumbs, initializeDatabase]);

  const selectedIssue = issues.find((i) => i.id === selectedMapIssueId);

  // Run mock route routing calculations
  const calculateRoute = async () => {
    if (!selectedIssue) return;
    
    // Simulate starting at a central municipal dispatch station
    const dispatchStart: [number, number] = [12.9716, 77.5946];
    const destination: [number, number] = [selectedIssue.location.latitude, selectedIssue.location.longitude];
    
    toast.info("Calculating optimal dispatch route vectors...");
    
    try {
      const route = await routingService.getRoute(dispatchStart, destination, "officer");
      setActiveRoute(route);
      toast.success(`Optimal Route Found: ${route.distanceKm}km distance. Travel SLA: ${route.durationMinutes} mins.`);
    } catch (err) {
      toast.error("Failed to generate routing coordinates.");
    }
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GIS & Digital Twin Command Center</h1>
            <p className="text-sm text-muted-foreground">Real-time municipal incidents tracking, administrative overlays, and smart dispatches.</p>
          </div>
        </div>
      </Reveal>

      {/* Main operational center grid layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
        {/* Left Side: Map Controls & Routers */}
        <div className="space-y-5 lg:h-[calc(100vh-180px)] lg:overflow-y-auto pr-1">
          <MapControls />
          <RouteEngine />
          <TimelinePlayback />
        </div>

        {/* Center: Live Map Canvas */}
        <div className="relative flex flex-col h-[520px] lg:h-[calc(100vh-180px)] min-h-[400px]">
          <MapLoader onIssueSelect={(id) => setSelectedMapIssueId(id)} />

          {/* Floating Selected Issue preview overlay card at bottom */}
          {selectedIssue && (
            <div className="absolute bottom-4 left-4 right-4 z-[999] rounded-2xl border border-border bg-card/95 p-4 shadow-glow backdrop-blur max-w-lg mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{selectedIssue.refNumber}</span>
                  <h4 className="text-xs font-semibold mt-0.5">{selectedIssue.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-1 line-clamp-1">{selectedIssue.location.address}</p>
                </div>
                <button
                  onClick={() => setSelectedMapIssueId(null)}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-foreground ml-2"
                >
                  Close
                </button>
              </div>

              <div className="mt-3.5 flex items-center justify-between gap-3 pt-2.5 border-t border-border/60">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                  selectedIssue.priority === "urgent" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                )}>
                  {selectedIssue.priority}
                </span>

                <button
                  onClick={calculateRoute}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Dispatch Route</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Spatial Analytics Sidebar */}
        {analytics && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-5 lg:h-[calc(100vh-180px)] lg:overflow-y-auto">
            <h3 className="text-xs font-bold flex items-center gap-1.5 border-b border-border pb-3">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <span>Spatial Analytics Panel</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Most Affected Ward</span>
                <span className="font-semibold text-foreground mt-0.5 block">{analytics.mostAffectedWard}</span>
              </div>
              
              <div className="border-t border-border/60 pt-3">
                <span className="text-muted-foreground block text-[10px]">Fastest Response Unit</span>
                <span className="font-semibold text-success mt-0.5 block">{analytics.fastestDept}</span>
              </div>

              <div className="border-t border-border/60 pt-3">
                <span className="text-muted-foreground block text-[10px]">Average SLA Time</span>
                <span className="font-semibold text-foreground mt-0.5 block">{analytics.avgResponseHours} Hours</span>
              </div>

              <div className="border-t border-border/60 pt-3 space-y-2">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Department SLA ratings</span>
                <ul className="space-y-2.5">
                  {analytics.departmentPerformance?.map((dept: any) => (
                    <li key={dept.name} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium">{dept.name}</span>
                        <span className="font-semibold">{dept.rating}% resolved</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${dept.rating}%` }}></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DigitalTwinMapPage;
