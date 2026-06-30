import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccessibilityState {
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  textSize: "normal" | "large" | "huge";
  toggleHighContrast: () => void;
  toggleDyslexicFont: () => void;
  toggleReducedMotion: () => void;
  setTextSize: (size: "normal" | "large" | "huge") => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      highContrast: false,
      dyslexicFont: false,
      reducedMotion: false,
      textSize: "normal",
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleDyslexicFont: () => set((state) => ({ dyslexicFont: !state.dyslexicFont })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      setTextSize: (size) => set({ textSize: size }),
    }),
    { name: "community-hero-accessibility-preferences" }
  )
);
