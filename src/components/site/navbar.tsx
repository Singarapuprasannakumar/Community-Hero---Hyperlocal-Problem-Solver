import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, LogOut, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { googleLogout } from "@react-oauth/google";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/impact", label: "Impact" },
  { to: "/ai", label: "AI" },
  { to: "/pricing", label: "Pricing" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleLogout() {
    googleLogout();
    useAuthStore.getState().logout();
    navigate({ to: "/" });
    toast.success("Logged out successfully");
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "pt-2" : "pt-4",
        )}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-full border border-border/70 px-3 py-2 transition-all duration-500",
              scrolled ? "glass-strong shadow-soft" : "bg-background/40 backdrop-blur-md",
            )}
          >

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((n) => {
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-secondary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Search"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur transition-colors hover:bg-card sm:inline-flex"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                aria-label="Notifications"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur transition-colors hover:bg-card sm:inline-flex"
              >
                <Bell className="h-4 w-4" />
              </button>
              <ThemeToggle />

              {/* --- Auth-aware desktop buttons --- */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden rounded-full px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] sm:inline-flex"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    Dashboard
                  </Link>
                  <button
                    aria-label="Account"
                    onClick={() => navigate({ to: "/dashboard/settings" })}
                    className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur transition-colors hover:bg-card sm:inline-flex"
                    title={user?.name ?? "Profile"}
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur transition-colors hover:bg-card sm:inline-flex"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="ml-1 hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                  >
                    Login
                  </Link>
                  <Link
                    to="/dashboard"
                    className="hidden rounded-full px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] sm:inline-flex"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 backdrop-blur lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- Mobile drawer --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm glass-strong border-l border-border p-6"
            >
              <div className="flex items-center justify-between">

                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                {/* --- Auth-aware mobile buttons --- */}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="rounded-full px-4 py-2.5 text-center text-sm font-medium text-white shadow-glow"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium"
                    >
                      <span className="inline-flex items-center gap-2">
                        <User className="h-4 w-4" /> {user?.name ?? "Profile"}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium inline-flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/dashboard"
                      className="rounded-full px-4 py-2.5 text-center text-sm font-medium text-white shadow-glow"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      Open dashboard
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}