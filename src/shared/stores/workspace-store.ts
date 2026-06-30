import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkspaceInfo } from "../types/user-types";

interface WorkspaceState {
  workspaces: WorkspaceInfo[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
  error: string | null;
  setWorkspaces: (workspaces: WorkspaceInfo[]) => void;
  setActiveWorkspace: (id: string) => void;
  getActiveWorkspace: () => WorkspaceInfo | null;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [
        { id: "ws-blr-west", name: "Bengaluru West Ward", region: "Bengaluru", role: "officer", isActive: true },
        { id: "ws-blr-east", name: "Bengaluru East Ward", region: "Bengaluru", role: "officer", isActive: false },
        { id: "ws-pune-central", name: "Pune Central Zone", region: "Pune", role: "volunteer", isActive: false },
      ],
      activeWorkspaceId: "ws-blr-west",
      isLoading: false,
      error: null,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setActiveWorkspace: (id) =>
        set((state) => {
          const updated = state.workspaces.map((ws) => ({
            ...ws,
            isActive: ws.id === id,
          }));
          return {
            workspaces: updated,
            activeWorkspaceId: id,
          };
        }),
      getActiveWorkspace: () => {
        const state = get();
        return state.workspaces.find((ws) => ws.id === state.activeWorkspaceId) || null;
      },
    }),
    {
      name: "community-hero-workspace-storage",
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        workspaces: state.workspaces,
      }),
    }
  )
);
