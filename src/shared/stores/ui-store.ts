import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  currentBreadcrumbs: { label: string; to?: string }[];
  isPresenterConsoleVisible: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setBreadcrumbs: (breadcrumbs: { label: string; to?: string }[]) => void;
  setPresenterConsoleVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationDrawerOpen: false,
  currentBreadcrumbs: [{ label: "Dashboard", to: "/dashboard" }],
  isPresenterConsoleVisible: true,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  setBreadcrumbs: (breadcrumbs) => set({ currentBreadcrumbs: breadcrumbs }),
  setPresenterConsoleVisible: (visible) => set({ isPresenterConsoleVisible: visible }),
}));
