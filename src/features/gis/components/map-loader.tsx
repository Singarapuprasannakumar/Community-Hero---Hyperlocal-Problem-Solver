import { useState, useEffect } from "react";
import { Loader2, Map } from "lucide-react";

interface MapLoaderProps {
  onIssueSelect?: (id: string | null) => void;
}

export function MapLoader({ onIssueSelect }: MapLoaderProps) {
  const [MountedMap, setMountedMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamic import to bypass node SSR compilation exceptions
    import("./city-map")
      .then((module) => {
        setMountedMap(() => module.CityMap);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Vite dynamic import of CityMap failed:", err);
      });
  }, []);

  if (isLoading || !MountedMap) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/30 rounded-3xl border border-border text-center p-8 min-h-[500px]">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Map className="h-6 w-6 animate-pulse" />
          <Loader2 className="absolute inset-0 h-full w-full text-primary animate-spin" />
        </div>
        <h4 className="mt-4 font-semibold text-sm">Loading GIS Canvas</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
          Initializing WebGL layers, coordinate clusters, and digital twin overlays...
        </p>
      </div>
    );
  }

  const Rendered = MountedMap;
  return <Rendered onIssueSelect={onIssueSelect} />;
}
export default MapLoader;
