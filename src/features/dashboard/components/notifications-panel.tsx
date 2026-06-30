import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, X, Sparkles, Megaphone, Info } from "lucide-react";
import { useNotificationStore } from "@/shared/stores/notification-store";
import { useUIStore } from "@/shared/stores/ui-store";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  triage: Sparkles,
  updates: Info,
  rewards: TrophyIcon, // Custom trophy implementation below
  announcements: Megaphone,
};

function TrophyIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 0-6 6v5a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6z" />
    </svg>
  );
}

const CATEGORY_STYLES = {
  triage: "bg-blue-500/10 text-blue-500",
  updates: "bg-amber-500/10 text-amber-500",
  rewards: "bg-emerald-500/10 text-emerald-500",
  announcements: "bg-purple-500/10 text-purple-500",
};

export function NotificationsPanel() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useUIStore();

  return (
    <AnimatePresence>
      {notificationDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-glow"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <Check className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setNotificationDrawerOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Bell className="h-10 w-10 text-muted-foreground/40 animate-pulse" />
                  <p className="mt-4 text-sm font-medium text-muted-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground/75">You have no unread notifications.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = CATEGORY_ICONS[n.category] || Info;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "relative flex gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-soft",
                        !n.read ? "border-l-4 border-l-primary" : ""
                      )}
                    >
                      <div className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", CATEGORY_STYLES[n.category])}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn("text-sm font-semibold truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground/80 shrink-0">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {n.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                            n.priority === "high" ? "bg-destructive/15 text-destructive" :
                            n.priority === "medium" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                          )}>
                            {n.priority}
                          </span>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            {!n.read && (
                              <button
                                onClick={() => markAsRead(n.id)}
                                className="rounded-md p-1 hover:bg-secondary text-primary"
                                title="Mark read"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(n.id)}
                              className="rounded-md p-1 hover:bg-secondary text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
