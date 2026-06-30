import { useAuditStore } from "@/shared/stores/enterprise-store";
import { ShieldCheck, Laptop, Globe } from "lucide-react";

export function AuditHistory() {
  const { auditLogs } = useAuditStore();

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Municipal Operations Audit Log
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold">
              <th className="pb-3 w-[120px]">Timestamp</th>
              <th className="pb-3">User</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Change Value</th>
              <th className="pb-3 hidden sm:table-cell">Client Info</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors text-[11px]">
                <td className="py-3 font-mono text-[10px] text-muted-foreground/80">
                  {new Date(log.timestamp).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </td>
                <td className="py-3 font-semibold text-foreground">
                  {log.actorName}
                  <span className="block text-[9px] font-normal text-muted-foreground capitalize">{log.actorRole}</span>
                </td>
                <td className="py-3 text-muted-foreground leading-normal">{log.action}</td>
                <td className="py-3">
                  {log.previousValue || log.newValue ? (
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="line-through text-muted-foreground/70">{log.previousValue || "none"}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold text-success">{log.newValue || "none"}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="py-3 hidden sm:table-cell text-[9px] text-muted-foreground/80 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 shrink-0" />
                    <span>{log.ip}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Laptop className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[120px]">{log.device}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AuditHistory;
