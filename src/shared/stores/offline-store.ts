import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface QueuedAction {
  id: string;
  type: "create_issue" | "post_comment" | "verify_incident";
  payload: any;
  timestamp: string;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  actionQueue: QueuedAction[];
  setOnlineStatus: (status: boolean) => void;
  addToQueue: (action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">) => void;
  processQueue: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      actionQueue: [],
      setOnlineStatus: (status) => {
        set({ isOnline: status });
        if (status) {
          get().processQueue();
        }
      },
      addToQueue: (act) => {
        const newAct: QueuedAction = {
          ...act,
          id: `off-act-${Math.random().toString(36).substr(2)}`,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        };
        set((state) => ({ actionQueue: [...state.actionQueue, newAct] }));
        toast.info("Offline: Action has been queued for synchronization.");
      },
      processQueue: () => {
        const { actionQueue } = get();
        if (actionQueue.length === 0) return;

        toast.success(`Online: Synchronizing ${actionQueue.length} queued operational actions...`);
        // Simulate sending items to mock database
        set({ actionQueue: [] });
      },
    }),
    { name: "community-hero-offline-sync" }
  )
);
