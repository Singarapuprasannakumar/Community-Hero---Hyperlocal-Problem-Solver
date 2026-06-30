import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Grid,
  List as ListIcon,
  MapPin,
  ChevronRight,
  TrendingUp,
  Tag,
  Loader2,
  Trash2
} from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { Issue, IssueStatus, IssuePriority, IssueSeverity } from "@/shared/types/issue-types";
import { Reveal, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/issues/")({
  head: () => ({
    meta: [
      { title: "Issues — Community Hero AI" },
    ],
  }),
  component: IssuesPage,
});

const STATUS_LABELS: Record<IssueStatus, { text: string; style: string }> = {
  draft: { text: "Draft", style: "bg-secondary text-foreground border-border" },
  submitted: { text: "Submitted", style: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  ai_processing: { text: "AI Processing", style: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  pending_verification: { text: "Pending Verification", style: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  verified: { text: "Verified", style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  assigned: { text: "Assigned", style: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  accepted: { text: "Accepted", style: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  in_progress: { text: "In Progress", style: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  waiting_for_materials: { text: "Waiting for Materials", style: "bg-stone-500/10 text-stone-500 border-stone-500/20" },
  escalated: { text: "Escalated", style: "bg-destructive/15 text-destructive border-destructive/20" },
  resolved: { text: "Resolved", style: "bg-success/15 text-success border-success/30" },
  rejected: { text: "Rejected", style: "bg-destructive/10 text-destructive border-destructive/10" },
  closed: { text: "Closed", style: "bg-foreground/10 text-foreground border-foreground/10" },
  reopened: { text: "Reopened", style: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  cancelled: { text: "Cancelled", style: "bg-secondary text-muted-foreground border-border" },
};

function IssuesPage() {
  const { setBreadcrumbs } = useUIStore();
  const { issues, initializeDatabase, isLoading, deleteIssue } = useIssueStore();

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority" | "severity">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Initialize DB on mount
  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Issues" },
    ]);
  }, [setBreadcrumbs]);

  // Filter logic
  const filteredIssues = issues.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.refNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.location.address.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCat === "all" || i.category === selectedCat;
    const matchesStatus = selectedStatus === "all" || i.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || i.priority === selectedPriority;

    return matchesSearch && matchesCat && matchesStatus && matchesPriority;
  });

  // Sorting logic
  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
  const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "priority") {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    }
    if (sortBy === "severity") {
      return (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedIssues.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (issue: Issue) => {
    if (!window.confirm(`Are you sure you want to delete this issue: "${issue.title}"?\nThis action cannot be undone.`)) {
      return;
    }
    const promise = deleteIssue(issue.id);
    toast.promise(promise, {
      loading: "Deleting issue from backend...",
      success: () => `Issue ${issue.refNumber} deleted successfully.`,
      error: (err) => err?.message || "Failed to delete issue from backend.",
    });
  };

  const handleExportCsv = () => {
    if (filteredIssues.length === 0) {
      toast.error("No incident records available to export.");
      return;
    }
    
    // Headers
    const headers = ["Reference Number", "Title", "Category", "Subcategory", "Status", "Priority", "Severity", "Latitude", "Longitude", "Address", "Created At"];
    
    // Rows
    const rows = filteredIssues.map((issue) => [
      issue.refNumber,
      `"${issue.title.replace(/"/g, '""')}"`,
      issue.category,
      issue.subcategory,
      issue.status,
      issue.priority,
      issue.severity,
      issue.location.latitude,
      issue.location.longitude,
      `"${issue.location.address.replace(/"/g, '""')}"`,
      issue.createdAt
    ]);
    
    // Build CSV string
    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `community_hero_incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Export Successful: ${filteredIssues.length} incident records downloaded.`);
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Issues</h1>
            <p className="text-sm text-muted-foreground">Track and manage citizen-filed reports in real-time.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold hover:bg-secondary transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <Link
              to="/dashboard/issues/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Dynamic filters panel */}
      <Reveal>
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by ID, title, description, address..."
                className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            {/* Sorting */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="priority">Highest priority</option>
                <option value="severity">Highest severity</option>
              </select>
            </div>

            {/* Layout Toggles */}
            <div className="flex border border-border rounded-xl overflow-hidden shrink-0">
              <button
                onClick={() => setLayout("grid")}
                className={cn("p-1.5 hover:bg-secondary", layout === "grid" ? "bg-secondary text-primary" : "text-muted-foreground")}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={cn("p-1.5 hover:bg-secondary", layout === "list" ? "bg-secondary text-primary" : "text-muted-foreground")}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Category & Status toggles */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
            <select
              value={selectedCat}
              onChange={(e) => { setSelectedCat(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Streetlights">Streetlights</option>
              <option value="Garbage">Garbage</option>
              <option value="Drainage">Drainage</option>
              <option value="Traffic">Traffic</option>
              <option value="Electricity">Electricity</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => { setSelectedPriority(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <span className="ml-auto text-xs text-muted-foreground self-center">
              Found {filteredIssues.length} records
            </span>
          </div>
        </div>
      </Reveal>

      {/* Main listing view */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center bg-card border border-border rounded-3xl p-8">
          <AlertCircle className="h-10 w-10 text-muted-foreground/45" />
          <h3 className="mt-4 font-semibold">No issues found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try reporting an issue or check back later.</p>
        </div>
      ) : layout === "grid" ? (
        <Reveal variants={staggerContainer(0.05)}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((issue) => (
              <motion.div
                key={issue.id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{issue.refNumber}</span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                    STATUS_LABELS[issue.status]?.style || ""
                  )}>
                    {STATUS_LABELS[issue.status]?.text || issue.status}
                  </span>
                </div>
                <h4 className="mt-3 font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {issue.title}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[180px]">{issue.location.address}</span>
                </div>
                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                    issue.priority === "urgent" ? "bg-destructive/15 text-destructive" :
                    issue.priority === "high" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                  )}>
                    {issue.priority}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(issue)}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-xl border border-destructive/25 bg-destructive/5 hover:bg-destructive/15 text-destructive transition-all"
                      title="Delete issue"
                      aria-label={`Delete issue ${issue.refNumber}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to="/dashboard/issues/$issueId"
                      params={{ issueId: issue.id }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all shadow-glow"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      ) : (
        /* List Layout */
        <Reveal>
          <div className="border border-border bg-card rounded-3xl overflow-hidden divide-y divide-border">
            {currentItems.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/40 transition-colors text-xs">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono text-muted-foreground/80 shrink-0">{issue.refNumber}</span>
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate max-w-[280px]">{issue.title}</h4>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[320px]">{issue.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                    STATUS_LABELS[issue.status]?.style || ""
                  )}>
                    {STATUS_LABELS[issue.status]?.text || issue.status}
                  </span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                    issue.priority === "urgent" ? "bg-destructive/15 text-destructive" :
                    issue.priority === "high" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                  )}>
                    {issue.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(issue)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-destructive/25 bg-destructive/5 hover:bg-destructive/15 text-destructive transition-all"
                    title="Delete issue"
                    aria-label={`Delete issue ${issue.refNumber}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    to="/dashboard/issues/$issueId"
                    params={{ issueId: issue.id }}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary transition-all shadow-glow"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Reveal>
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
