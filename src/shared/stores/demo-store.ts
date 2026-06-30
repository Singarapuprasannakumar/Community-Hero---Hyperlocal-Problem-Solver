import { create } from "zustand";

export type WeatherType = "sunny" | "cloudy" | "rain" | "heavy_rain" | "storm" | "heatwave" | "fog";
export type ScenarioType = "normal" | "rain" | "traffic" | "power" | "garbage" | "festival" | "story";

interface DemoState {
  isDemoMode: boolean;
  weather: WeatherType;
  currentScenario: ScenarioType;
  storyStep: number;
  speedMultiplier: number;
  metrics: {
    eventsGenerated: number;
    issuesCreated: number;
    routesCalculated: number;
    volunteersActivated: number;
  };
  setDemoMode: (enabled: boolean) => void;
  setWeather: (weather: WeatherType) => void;
  setScenario: (scenario: ScenarioType) => void;
  setStoryStep: (step: number) => void;
  setSpeedMultiplier: (speed: number) => void;
  incrementMetric: (key: keyof DemoState["metrics"]) => void;
  resetDemo: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoMode: false,
  weather: "sunny",
  currentScenario: "normal",
  storyStep: 0,
  speedMultiplier: 1,
  metrics: {
    eventsGenerated: 0,
    issuesCreated: 0,
    routesCalculated: 0,
    volunteersActivated: 0,
  },
  setDemoMode: (enabled) => set({ isDemoMode: enabled }),
  setWeather: (weather) => set({ weather }),
  setScenario: (scenario) => set({ currentScenario: scenario, storyStep: 0 }),
  setStoryStep: (step) => set({ storyStep: step }),
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  incrementMetric: (key) =>
    set((state) => ({
      metrics: { ...state.metrics, [key]: state.metrics[key] + 1 },
    })),
  resetDemo: () =>
    set({
      isDemoMode: false,
      weather: "sunny",
      currentScenario: "normal",
      storyStep: 0,
      speedMultiplier: 1,
      metrics: {
        eventsGenerated: 0,
        issuesCreated: 0,
        routesCalculated: 0,
        volunteersActivated: 0,
      },
    }),
}));
