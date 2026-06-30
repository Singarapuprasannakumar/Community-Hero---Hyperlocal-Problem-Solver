import { useAccessibilityStore } from "@/shared/stores/accessibility-store";
import { Eye, Shield, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityPanel() {
  const {
    highContrast,
    dyslexicFont,
    reducedMotion,
    textSize,
    toggleHighContrast,
    toggleDyslexicFont,
    toggleReducedMotion,
    setTextSize
  } = useAccessibilityStore();

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Eye className="h-4.5 w-4.5 text-primary" />
        <span>Accessibility Preferences (WCAG AA Compliance)</span>
      </h3>

      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        {/* Toggle 1: High Contrast */}
        <button
          onClick={toggleHighContrast}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1 font-semibold",
            highContrast ? "bg-primary border-primary text-primary-foreground" : "bg-secondary/20 border-border hover:bg-secondary/40"
          )}
        >
          <span>High Contrast Mode</span>
          <span className="text-[10px] opacity-80">{highContrast ? "Enabled" : "Disabled"}</span>
        </button>

        {/* Toggle 2: Dyslexic Font */}
        <button
          onClick={toggleDyslexicFont}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1 font-semibold",
            dyslexicFont ? "bg-primary border-primary text-primary-foreground" : "bg-secondary/20 border-border hover:bg-secondary/40"
          )}
        >
          <span>Dyslexic Font Option</span>
          <span className="text-[10px] opacity-80">{dyslexicFont ? "Active" : "Standard"}</span>
        </button>

        {/* Toggle 3: Reduced Motion */}
        <button
          onClick={toggleReducedMotion}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1 font-semibold",
            reducedMotion ? "bg-primary border-primary text-primary-foreground" : "bg-secondary/20 border-border hover:bg-secondary/40"
          )}
        >
          <span>Reduced Motion</span>
          <span className="text-[10px] opacity-80">{reducedMotion ? "Active" : "Standard"}</span>
        </button>
      </div>

      {/* Font Zoom Options */}
      <div className="space-y-2 pt-2 text-xs border-t border-border/50">
        <span className="font-semibold text-muted-foreground flex items-center gap-1">
          <ZoomIn className="h-4 w-4 text-primary" />
          Text Zoom scale
        </span>
        <div className="flex gap-2">
          {(["normal", "large", "huge"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setTextSize(size)}
              className={cn(
                "rounded-xl px-4 py-1.5 font-bold uppercase transition-all text-[10px]",
                textSize === size ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-secondary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AccessibilityPanel;
