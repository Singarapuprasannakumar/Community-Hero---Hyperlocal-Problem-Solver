import { useDemoStore } from "@/shared/stores/demo-store";
import { useUIStore } from "@/shared/stores/ui-store";
import { demoEngine } from "@/shared/services/demo-engine";
import { demoScenarios } from "@/shared/services/demo-scenarios";
import { Play, Pause, RefreshCw, AlertTriangle, CloudRain, ShieldAlert, Sliders, Zap, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DemoPresenterBar() {
  const {
    isDemoMode,
    currentScenario,
    storyStep,
    speedMultiplier,
    metrics,
    setDemoMode,
    setScenario,
    setSpeedMultiplier,
  } = useDemoStore();

  const { isPresenterConsoleVisible, setPresenterConsoleVisible } = useUIStore();

  const handleToggleDemo = () => {
    const nextStatus = !isDemoMode;
    setDemoMode(nextStatus);
    if (nextStatus) {
      demoEngine.start();
    } else {
      demoEngine.stop();
    }
  };

  const handleScenarioChange = (scenario: "rain" | "traffic" | "garbage" | "power") => {
    setScenario(scenario);
    if (scenario === "rain") demoScenarios.triggerHeavyRain();
    if (scenario === "traffic") demoScenarios.triggerTrafficCrisis();
    if (scenario === "garbage") demoScenarios.triggerGarbageCrisis();
    if (scenario === "power") demoScenarios.triggerPowerFailure();
  };

  const handleStoryNext = () => {
    if (currentScenario !== "story") {
      setScenario("story");
    }
    const nextStep = storyStep >= 8 ? 1 : storyStep + 1;
    demoScenarios.executeStoryStep(nextStep);
  };

  const handleStoryPrev = () => {
    if (currentScenario !== "story") {
      setScenario("story");
    }
    const prevStep = storyStep <= 1 ? 8 : storyStep - 1;
    demoScenarios.executeStoryStep(prevStep);
  };

  if (!isPresenterConsoleVisible) {
    return (
      <button
        onClick={() => setPresenterConsoleVisible(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-primary/95 backdrop-blur-md px-4.5 py-2.5 text-xs font-bold text-white shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 border border-primary/25"
        title="Open Municipal Simulation Console"
      >
        <Sliders className="h-4 w-4" />
        <span>Simulation Console</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-background/85 backdrop-blur-md border border-border rounded-3xl p-4 shadow-soft flex flex-col gap-3 max-w-[92%] sm:max-w-xl text-xs w-[480px]">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-1.5 font-bold">
          <Sliders className="h-4 w-4 text-primary" />
          <span>Municipal Simulation Console</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Speed settings */}
          <select
            value={speedMultiplier}
            onChange={(e) => {
              const speed = Number(e.target.value);
              setSpeedMultiplier(speed);
              if (isDemoMode) demoEngine.start();
            }}
            className="rounded-xl border border-border bg-background px-2 py-0.5 text-[10px] outline-none"
          >
            <option value="1">1x Speed</option>
            <option value="2">2x Speed</option>
            <option value="5">5x Speed</option>
          </select>
          <button
            onClick={() => {
              demoScenarios.resetAll();
              demoEngine.stop();
              toast.success("Simulation reset completed.");
            }}
            className="p-1 rounded-lg hover:bg-secondary border border-border"
            title="Reset simulation parameters"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {/* Close button */}
          <button
            onClick={() => setPresenterConsoleVisible(false)}
            className="p-1 rounded-lg hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Close console"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main triggers and steps */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: General city alerts */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Incident Scenarios</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleScenarioChange("rain")}
              className="flex items-center justify-center gap-1 border border-border hover:bg-secondary/40 p-2 rounded-xl text-[10px] font-semibold"
            >
              <CloudRain className="h-3 w-3 text-blue-500" />
              <span>Heavy Rain</span>
            </button>
            <button
              onClick={() => handleScenarioChange("traffic")}
              className="flex items-center justify-center gap-1 border border-border hover:bg-secondary/40 p-2 rounded-xl text-[10px] font-semibold"
            >
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span>Traffic Grid</span>
            </button>
            <button
              onClick={() => handleScenarioChange("garbage")}
              className="flex items-center justify-center gap-1 border border-border hover:bg-secondary/40 p-2 rounded-xl text-[10px] font-semibold"
            >
              <ShieldAlert className="h-3 w-3 text-purple-500" />
              <span>Waste Overflow</span>
            </button>
            <button
              onClick={() => handleScenarioChange("power")}
              className="flex items-center justify-center gap-1 border border-border hover:bg-secondary/40 p-2 rounded-xl text-[10px] font-semibold"
            >
              <Zap className="h-3 w-3 text-destructive" />
              <span>Grid Outage</span>
            </button>
          </div>
        </div>

        {/* Right: Step Stepper Story Mode */}
        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Presenter Story Flow</span>
            <div className="flex items-center justify-between mt-1 text-[11px] font-bold text-foreground">
              <span>{currentScenario === "story" ? `Step ${storyStep} of 8` : "Inactive"}</span>
            </div>
          </div>
          <div className="space-y-1">
            <button
              onClick={handleStoryNext}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2 font-bold hover:bg-primary/95 transition-all text-[10px] flex items-center justify-center gap-1 shadow-glow"
            >
              <span>Execute Next Step</span>
            </button>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={handleStoryPrev}
                className="rounded-xl border border-border bg-background py-1 font-bold hover:bg-secondary text-[9px] transition-colors"
                title="Execute previous step"
              >
                Prev Step
              </button>
              <button
                onClick={() => {
                  demoScenarios.resetAll();
                  toast.success("Story flow reset to start.");
                }}
                className="rounded-xl border border-border bg-background py-1 font-bold hover:bg-secondary text-[9px] text-destructive transition-colors"
                title="Reset story flow"
              >
                Reset Flow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Mode state toggles */}
      <div className="border-t border-border/50 pt-2 flex items-center justify-between text-[10px] text-muted-foreground/80 font-semibold">
        <button
          onClick={handleToggleDemo}
          className={cn(
            "rounded-xl px-4 py-1.5 font-bold transition-all text-white",
            isDemoMode ? "bg-success hover:bg-success/90" : "bg-primary hover:bg-primary/90"
          )}
        >
          <span className="flex items-center gap-1">
            {isDemoMode ? <Pause className="h-3 w-3 fill-white" /> : <Play className="h-3 w-3 fill-white" />}
            {isDemoMode ? "Simulating Live" : "Start Simulator"}
          </span>
        </button>
        <div className="flex gap-3">
          <span>Events: {metrics.eventsGenerated}</span>
          <span>Calculated Routes: {metrics.routesCalculated}</span>
        </div>
      </div>
    </div>
  );
}
export default DemoPresenterBar;
