import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Community Hero AI home">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl shadow-glow" style={{ background: "var(--gradient-brand)" }}>
        <span className="absolute inset-0.5 rounded-[10px] bg-background/10 backdrop-blur" />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        Community Hero <span className="text-gradient">AI</span>
      </span>
    </Link>
  );
}