import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGISStore } from "@/shared/stores/gis-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { geofenceService } from "@/shared/services/gis-service";
import { cn } from "@/lib/utils";

interface CityMapProps {
  onIssueSelect?: (id: string | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Roads & Transit": "#3b82f6", // Blue
  "Water Supply": "#06b6d4", // Cyan
  "Sanitation": "#8b5cf6", // Purple
  "Parks & Trees": "#10b981", // Green
  "Hazards & Safety": "#f59e0b", // Amber
};

export function CityMap({ onIssueSelect }: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Zustand State hooks
  const { layers, activeHeatmap, selectedMapIssueId, activeRoute, setSelectedMapIssueId, timelineFrame, searchQuery } = useGISStore();
  const { issues, initializeDatabase } = useIssueStore();

  // Markers and Vector overlays caching refs
  const markersRef = useRef<L.LayerGroup | null>(null);
  const wardsRef = useRef<L.LayerGroup | null>(null);
  const routeVectorRef = useRef<L.Polyline | null>(null);
  const heatOverlayRef = useRef<L.LayerGroup | null>(null);

  // Ensure Issue DB is loaded
  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  // 1. Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map centered around Bangalore
    const bglCenter: [number, number] = [12.9716, 77.5946];
    const map = L.map(mapContainerRef.current, {
      center: bglCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark-themed premium vector tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);
    wardsRef.current = L.layerGroup().addTo(map);
    heatOverlayRef.current = L.layerGroup().addTo(map);

    // Call invalidateSize to fix size in hidden or resizing containers
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Ward boundary rendering
  useEffect(() => {
    const map = mapRef.current;
    const wardGroup = wardsRef.current;
    if (!map || !wardGroup) return;

    wardGroup.clearLayers();

    if (layers.wards) {
      const wardData = geofenceService.getWardBoundaries();
      wardData.forEach((w) => {
        const poly = L.polygon(w.polygon, {
          color: w.color,
          fillColor: w.color,
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4, 4",
        });
        poly.bindTooltip(w.name, { sticky: true, className: "text-[10px] font-semibold bg-background border border-border rounded p-1" });
        wardGroup.addLayer(poly);
      });
    }
  }, [layers.wards]);

  // 3. Issue Markers and Clusters Rendering
  useEffect(() => {
    const map = mapRef.current;
    const markerGroup = markersRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    if (!layers.issues) return;

    // Filter issues based on timeline frame and search querying
    const maxTime = new Date().getTime();
    const minTime = maxTime - 86400000 * 10; // past 10 days
    const timeThreshold = minTime + (maxTime - minTime) * (timelineFrame / 100);

    const activeIssues = issues.filter((iss) => {
      const createdMs = new Date(iss.createdAt).getTime();
      if (createdMs > timeThreshold) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          iss.title.toLowerCase().includes(q) ||
          iss.refNumber.toLowerCase().includes(q) ||
          iss.location.address.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Populate markers on screen
    activeIssues.forEach((iss) => {
      const lat = iss.location.latitude;
      const lng = iss.location.longitude;

      const isSelected = selectedMapIssueId === iss.id;
      const isUrgent = iss.priority === "urgent";

      // Status marker styling class
      const statusColor =
        iss.status === "resolved" || iss.status === "closed" ? "bg-success" :
        isUrgent ? "bg-destructive animate-pulse" : "bg-primary";

      const color = CATEGORY_COLORS[iss.category] || "#3b82f6";

      // Create interactive HTML element marker
      const markerHtml = `
        <div class="relative flex items-center justify-center h-6 w-6">
          ${isUrgent && iss.status !== "resolved" ? `<div class="absolute h-6 w-6 rounded-full bg-destructive/30 animate-ping"></div>` : ""}
          <div class="h-3.5 w-3.5 rounded-full border border-white shadow-soft ${statusColor}" style="background-color: ${color}; transform: ${isSelected ? "scale(1.3)" : "scale(1)"}; border-color: ${isSelected ? "#fff" : "rgba(255,255,255,0.7)"}; transition: transform 0.2s;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Action listener
      marker.on("click", () => {
        setSelectedMapIssueId(iss.id);
        if (onIssueSelect) onIssueSelect(iss.id);
        map.setView([lat, lng], 15);
      });

      // Simple hover tooltips
      marker.bindTooltip(`
        <div class="text-[11px] font-semibold bg-background p-1.5 space-y-0.5 border border-border rounded-xl">
          <div>${iss.refNumber} · ${iss.category}</div>
          <div class="text-[10px] text-muted-foreground">${iss.title}</div>
        </div>
      `, { direction: "top", offset: [0, -10] });

      markerGroup.addLayer(marker);
    });
  }, [issues, layers.issues, timelineFrame, searchQuery, selectedMapIssueId, setSelectedMapIssueId, onIssueSelect]);

  // 4. Live layers rendering (active volunteers and officers moving)
  useEffect(() => {
    const map = mapRef.current;
    const markerGroup = markersRef.current;
    if (!map || !markerGroup) return;

    if (layers.officers) {
      // Plant dynamic Officer locations
      const officerLocs: [number, number][] = [
        [12.98, 77.62],
        [12.95, 77.60],
        [12.94, 77.65],
      ];

      officerLocs.forEach((loc, idx) => {
        const markerHtml = `
          <div class="relative flex h-6 w-6 items-center justify-center">
            <span class="absolute h-4 w-4 rounded-full bg-amber-500/35 animate-ping"></span>
            <span class="h-2.5 w-2.5 rounded-full border border-white bg-amber-500 shadow-soft"></span>
          </div>
        `;
        const icon = L.divIcon({ html: markerHtml, className: "officer-marker", iconSize: [24, 24], iconAnchor: [12, 12] });
        const marker = L.marker(loc, { icon });
        marker.bindTooltip(`Officer Dispatch Unit #${idx + 1}`, { direction: "top" });
        markerGroup.addLayer(marker);
      });
    }

    if (layers.emergency) {
      // Plant dynamic Hospital and Fire service pins
      const emergencyLocs = [
        { name: "Fortis Hospital - Ashok Nagar", type: "hospital", coords: [12.968, 77.605] },
        { name: "Fire & Emergency Station", type: "fire", coords: [12.978, 77.585] },
      ];

      emergencyLocs.forEach((loc) => {
        const color = loc.type === "hospital" ? "bg-red-500" : "bg-orange-500";
        const markerHtml = `
          <div class="flex h-5 w-5 items-center justify-center rounded-lg ${color} text-white font-bold text-[9px] border border-white shadow-soft">
            ${loc.type === "hospital" ? "H" : "F"}
          </div>
        `;
        const icon = L.divIcon({ html: markerHtml, className: "emergency-marker", iconSize: [20, 20], iconAnchor: [10, 10] });
        const marker = L.marker(loc.coords as [number, number], { icon });
        marker.bindTooltip(loc.name, { direction: "top" });
        markerGroup.addLayer(marker);
      });
    }
  }, [layers.officers, layers.emergency, layers.issues]);

  // 5. Active route vector path rendering
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeVectorRef.current) {
      map.removeLayer(routeVectorRef.current);
      routeVectorRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 0) {
      const line = L.polyline(activeRoute.coordinates, {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
        dashArray: "8, 6",
      }).addTo(map);

      // Fit map boundary to include entire route
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
      routeVectorRef.current = line;
    }
  }, [activeRoute]);

  // 6. Heatmap Density Overlays Rendering
  useEffect(() => {
    const map = mapRef.current;
    const heatGroup = heatOverlayRef.current;
    if (!map || !heatGroup) return;

    heatGroup.clearLayers();

    if (activeHeatmap) {
      // Gather positions to create glowing density radial circles
      const heatPositions = issues.map((iss) => {
        return {
          coords: [iss.location.latitude, iss.location.longitude] as [number, number],
          weight: iss.severity === "critical" ? 1.5 : 0.8,
        };
      });

      heatPositions.slice(0, 40).forEach((pos) => {
        const circle = L.circle(pos.coords, {
          radius: 120 * pos.weight,
          color: "transparent",
          fillColor: "#ef4444",
          fillOpacity: 0.15,
        });
        heatGroup.addLayer(circle);
      });
    }
  }, [activeHeatmap, issues]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border">
      <div ref={mapContainerRef} className="h-full w-full bg-[#111]" />
    </div>
  );
}
export default CityMap;
