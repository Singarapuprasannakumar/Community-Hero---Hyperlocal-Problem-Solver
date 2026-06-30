import { useGISStore } from "@/shared/stores/gis-store";
import { Layers, Search, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapControls() {
  const {
    layers,
    toggleLayer,
    activeHeatmap,
    setActiveHeatmap,
    searchQuery,
    setSearchQuery,
  } = useGISStore();

  const handleHeatmapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setActiveHeatmap(val === "none" ? null : val);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-5">
      {/* Smart Search */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>Smart Spatial Search</span>
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by ID, Ward, category, officer..."
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>Operational Layers</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.keys(layers).map((layerKey) => {
            const key = layerKey as keyof typeof layers;
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 hover:bg-secondary transition-all",
                  layers[key] ? "border-primary bg-primary/5 text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5 shrink-0" />
                <span className="capitalize">{key === "emergency" ? "Emergency" : key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Layer Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>AI Hotspot Heatmaps</span>
        </label>
        <select
          value={activeHeatmap || "none"}
          onChange={handleHeatmapChange}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="none">No Heatmap Overlay</option>
          <option value="density">Overall Incident Density</option>
          <option value="roads">Road Damage Concentration</option>
          <option value="water">Water Outage Grid</option>
          <option value="sanitation">Garbage & Dumping Hubs</option>
          <option value="flood">AI Flood Danger Risks</option>
        </select>
      </div>
    </div>
  );
}
export default MapControls;
