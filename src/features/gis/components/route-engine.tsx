import { useGISStore } from "@/shared/stores/gis-store";
import { Compass, Navigation, X, Clock, MapPin } from "lucide-react";

export function RouteEngine() {
  const { activeRoute, setActiveRoute } = useGISStore();

  if (!activeRoute) {
    return (
      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft text-center space-y-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground/60">
          <Compass className="h-4.5 w-4.5" />
        </div>
        <h4 className="text-xs font-semibold">Proximity Dispatch Routing</h4>
        <p className="text-[10px] text-muted-foreground leading-normal max-w-[200px] mx-auto">
          Select any incident node on the map to calculate operational routing lines and turn-by-turn steps.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-bold flex items-center gap-1.5">
          <Navigation className="h-4 w-4 text-primary animate-pulse" />
          <span>Active Dispatch Path</span>
        </h3>
        <button
          onClick={() => setActiveRoute(null)}
          className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-secondary/35 p-2 rounded-xl flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-[9px] text-muted-foreground block">Duration</span>
            <span className="font-semibold">{activeRoute.durationMinutes} Mins</span>
          </div>
        </div>
        <div className="bg-secondary/35 p-2 rounded-xl flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-[9px] text-muted-foreground block">Distance</span>
            <span className="font-semibold">{activeRoute.distanceKm} Km</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Turn-by-turn Instructions</span>
        <ol className="space-y-2 text-[10px] text-muted-foreground pl-3.5 list-decimal leading-relaxed">
          {activeRoute.steps.map((step, idx) => (
            <li key={idx} className="hover:text-foreground transition-colors">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export default RouteEngine;
