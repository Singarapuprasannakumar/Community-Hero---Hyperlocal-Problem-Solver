import { create } from "zustand";

export interface DiagnosticLog {
  id: string;
  category: "Application" | "Security" | "AI" | "GIS" | "Offline" | "Performance";
  message: string;
  timestamp: string;
  type: "info" | "warning" | "error";
}

interface DiagnosticsState {
  logs: DiagnosticLog[];
  addLog: (log: Omit<DiagnosticLog, "id" | "timestamp">) => void;
  clearLogs: () => void;
}

const initialLogs: DiagnosticLog[] = [
  { id: "diag-1", category: "Application", message: "Application bundle lazy loaded successfully.", timestamp: new Date(Date.now() - 60000).toISOString(), type: "info" },
  { id: "diag-2", category: "AI", message: "Vision regression inference model loaded in 45ms.", timestamp: new Date(Date.now() - 45000).toISOString(), type: "info" },
  { id: "diag-3", category: "Offline", message: "Service worker registration completed.", timestamp: new Date().toISOString(), type: "info" }
];

export const useDiagnosticsStore = create<DiagnosticsState>((set) => ({
  logs: initialLogs,
  addLog: (log) =>
    set((state) => ({
      logs: [
        {
          ...log,
          id: `diag-${Math.random().toString(36).substr(2)}`,
          timestamp: new Date().toISOString(),
        },
        ...state.logs.slice(0, 49) // Keep last 50 logs
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));
