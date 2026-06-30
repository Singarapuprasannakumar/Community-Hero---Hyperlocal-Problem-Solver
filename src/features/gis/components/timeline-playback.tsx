import { useEffect } from "react";
import { Play, Pause, FastForward, RotateCcw, Calendar } from "lucide-react";
import { useGISStore } from "@/shared/stores/gis-store";

export function TimelinePlayback() {
  const {
    timelineFrame,
    playbackSpeed,
    isPlaying,
    setTimelineFrame,
    setPlaybackSpeed,
    setIsPlaying,
  } = useGISStore();

  // Tick interval loop if playing is true
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimelineFrame(timelineFrame >= 100 ? 0 : timelineFrame + 2 * playbackSpeed);
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, timelineFrame, playbackSpeed, setTimelineFrame]);

  // Derive display date based on slider percentage
  const maxTime = new Date().getTime();
  const minTime = maxTime - 86400000 * 10; // past 10 days
  const currentTimestamp = minTime + (maxTime - minTime) * (timelineFrame / 100);
  const displayDate = new Date(currentTimestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-bold flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Timeline Playback</span>
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground/80 bg-secondary/40 px-2 py-0.5 rounded-lg">
          {displayDate}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-glow"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        {/* Playback Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={timelineFrame}
          onChange={(e) => setTimelineFrame(parseInt(e.target.value))}
          className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />

        {/* Speed Toggle */}
        <button
          onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 5 : 1)}
          className="flex items-center justify-center border border-border rounded-xl bg-background px-2.5 py-1 text-[10px] font-semibold hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <FastForward className="h-3 w-3 mr-1" />
          <span>{playbackSpeed}x</span>
        </button>
      </div>
    </div>
  );
}
export default TimelinePlayback;
