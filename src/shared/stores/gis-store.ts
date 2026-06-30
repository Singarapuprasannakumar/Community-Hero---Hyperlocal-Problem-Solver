import { create } from "zustand";

export interface ActiveRoute {
  coordinates: [number, number][];
  type: "officer" | "volunteer" | "emergency" | "maintenance";
  steps: string[];
  durationMinutes: number;
  distanceKm: number;
}

interface GISState {
  // Layers Toggles
  layers: {
    issues: boolean;
    wards: boolean;
    utilities: boolean;
    emergency: boolean;
    officers: boolean;
    volunteers: boolean;
    traffic: boolean;
    weather: boolean;
    buildings: boolean;
  };
  
  activeHeatmap: string | null; // "density" | "roads" | "water" | "sanitation" | "flood" | null
  selectedMapIssueId: string | null;
  activeRoute: ActiveRoute | null;
  geofenceZone: { type: "circle" | "polygon" | null; coordinates: [number, number][]; radius?: number } | null;
  
  // Timeline Playback
  timelineFrame: number; // 0 to 100 percentage of slider or timestamp offset
  playbackSpeed: number; // 1 | 2 | 5
  isPlaying: boolean;
  
  searchQuery: string;

  // Actions
  toggleLayer: (layerName: keyof GISState["layers"]) => void;
  setLayer: (layerName: keyof GISState["layers"], state: boolean) => void;
  setActiveHeatmap: (type: string | null) => void;
  setSelectedMapIssueId: (id: string | null) => void;
  setActiveRoute: (route: ActiveRoute | null) => void;
  setGeofenceZone: (zone: GISState["geofenceZone"]) => void;
  setTimelineFrame: (frame: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSearchQuery: (q: string) => void;
  resetGISStore: () => void;
}

const initialLayers = {
  issues: true,
  wards: true,
  utilities: false,
  emergency: true,
  officers: true,
  volunteers: true,
  traffic: false,
  weather: false,
  buildings: false,
};

export const useGISStore = create<GISState>((set) => ({
  layers: { ...initialLayers },
  activeHeatmap: null,
  selectedMapIssueId: null,
  activeRoute: null,
  geofenceZone: null,
  timelineFrame: 100, // Show all issues by default
  playbackSpeed: 1,
  isPlaying: false,
  searchQuery: "",

  toggleLayer: (name) =>
    set((state) => ({
      layers: { ...state.layers, [name]: !state.layers[name] },
    })),

  setLayer: (name, active) =>
    set((state) => ({
      layers: { ...state.layers, [name]: active },
    })),

  setActiveHeatmap: (activeHeatmap) => set({ activeHeatmap }),
  setSelectedMapIssueId: (selectedMapIssueId) => set({ selectedMapIssueId }),
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setGeofenceZone: (geofenceZone) => set({ geofenceZone }),
  setTimelineFrame: (timelineFrame) => set({ timelineFrame }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetGISStore: () =>
    set({
      layers: { ...initialLayers },
      activeHeatmap: null,
      selectedMapIssueId: null,
      activeRoute: null,
      geofenceZone: null,
      timelineFrame: 100,
      playbackSpeed: 1,
      isPlaying: false,
      searchQuery: "",
    }),
}));
