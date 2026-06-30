import { useNavigate } from "@tanstack/react-router";
import { useGISStore } from "@/shared/stores/gis-store";
import { toast } from "sonner";

export function CategoryDonutChart() {
  const navigate = useNavigate();
  const { setSearchQuery } = useGISStore();

  const data = [
    { label: "Roads & Transit", value: 38, color: "#3b82f6" },
    { label: "Water Supply", value: 24, color: "#06b6d4" },
    { label: "Sanitation", value: 18, color: "#8b5cf6" },
    { label: "Parks & Trees", value: 12, color: "#10b981" },
    { label: "Hazards & Safety", value: 8, color: "#f59e0b" },
  ];

  const handleDrilldown = (category: string) => {
    setSearchQuery(category);
    toast.success(`Drilling down into ${category} issues...`);
    navigate({ to: "/dashboard/issues" });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Incidents by Category
      </h3>
      
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* SVG Donut */}
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="4" />
            
            {/* Accumulate stroke dashes for segments */}
            {(() => {
              let offset = 0;
              return data.map((d, idx) => {
                const strokeDash = `${d.value} ${100 - d.value}`;
                const currentOffset = offset;
                offset += d.value;
                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={d.color}
                    strokeWidth="4.5"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={100 - currentOffset}
                    className="cursor-pointer hover:stroke-[5.5] transition-all"
                    onClick={() => handleDrilldown(d.label)}
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono">512</span>
            <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total Tickets</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs flex-1">
          {data.map((d) => (
            <button
              key={d.label}
              onClick={() => handleDrilldown(d.label)}
              className="flex items-center justify-between w-full hover:bg-secondary/45 p-1 rounded-lg text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="font-semibold truncate max-w-[130px]">{d.label}</span>
              </div>
              <span className="font-mono text-muted-foreground">{d.value}%</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HistoricalVolumeChart() {
  const navigate = useNavigate();

  // 7 days historical ticket counts
  const data = [
    { day: "Mon", count: 42 },
    { day: "Tue", count: 58 },
    { day: "Wed", count: 51 },
    { day: "Thu", count: 68 },
    { day: "Fri", count: 60 },
    { day: "Sat", count: 75 },
    { day: "Sun", count: 88 },
  ];

  const maxVal = 100;
  const height = 140;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Weekly Incident Volume Trends
      </h3>

      <div className="relative pt-4">
        {/* Custom SVG Line Chart */}
        <svg className="w-full" height={height} viewBox="0 0 400 140" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="70" x2="400" y2="70" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Area under curve */}
          <path
            d={`M 10,140 
                ${data.map((d, i) => `L ${10 + i * 62}, ${height - (d.count / maxVal) * height}`).join(" ")}
                L 382,140 Z`}
            fill="url(#gradient-area)"
            opacity="0.15"
          />

          {/* Line curve path */}
          <path
            d={data.map((d, i) => `${i === 0 ? "M" : "L"} ${10 + i * 62}, ${height - (d.count / maxVal) * height}`).join(" ")}
            fill="none"
            stroke="var(--color-primary, #3b82f6)"
            strokeWidth="2.5"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Interactive point circles */}
          {data.map((d, i) => {
            const cx = 10 + i * 62;
            const cy = height - (d.count / maxVal) * height;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="4.5"
                className="fill-primary stroke-card stroke-[2.5px] cursor-pointer hover:r-6 transition-all"
                onClick={() => {
                  toast.info(`Viewing issues filed on ${d.day}`);
                  navigate({ to: "/dashboard/issues" });
                }}
              />
            );
          })}
        </svg>

        {/* Labels */}
        <div className="flex justify-between text-[9px] text-muted-foreground/80 pt-2 px-1">
          {data.map((d) => (
            <span key={d.day} className="font-semibold">{d.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
