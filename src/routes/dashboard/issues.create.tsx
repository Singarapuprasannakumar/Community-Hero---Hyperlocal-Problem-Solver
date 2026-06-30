import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ReportIssueWizard } from "@/features/issues/components/report-issue-wizard";
import { useUIStore } from "@/shared/stores/ui-store";

export const Route = createFileRoute("/dashboard/issues/create")({
  head: () => ({
    meta: [
      { title: "Report Issue — Community Hero AI" },
    ],
  }),
  component: CreateIssuePage,
});

function CreateIssuePage() {
  const { setBreadcrumbs } = useUIStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Issues", to: "/dashboard/issues" },
      { label: "Report New Issue" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report Community Incident</h1>
        <p className="text-sm text-muted-foreground">AI-triaged, department routed, and tracked in real-time.</p>
      </div>
      <ReportIssueWizard />
    </div>
  );
}
