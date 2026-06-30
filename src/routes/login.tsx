import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { AnimatedBackground } from "@/components/site/animated-bg";
import { authService } from "@/shared/services/auth-service";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Community Hero AI" },
      { name: "description", content: "Sign in to your Community Hero AI workspace." },
    ],
  }),
  component: LoginPage,
});

/** Coloured Google "G" logo */
function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // ── Real Google OAuth via GIS popup ──────────────────────────────────────
  const startGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: async (codeResponse) => {
      // Note: With auth-code flow, we get an authorization code, not an ID token.
      // For ID token flow, we use the credential-based approach via GoogleLogin component.
      // We handle this in the credential-based handler below.
      console.log("Auth code response:", codeResponse);
    },
    onError: (error) => {
      if (error.error === "access_denied" || error.error === "popup_closed_by_user") {
        setGoogleError(null); // User cancelled — not an error
        toast.info("Google sign-in was cancelled.");
      } else {
        const msg = error.error_description ?? "Google sign-in failed. Please try again.";
        setGoogleError(msg);
        toast.error(msg);
      }
      setIsGoogleLoading(false);
    },
  });

  // ── ID-token based handler (called by the credential response) ───────────
  async function handleGoogleCredential(credential: string) {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const response = await authService.googleOAuth(credential);
      loginAction(response.user, response.token);
      toast.success(`Welcome, ${response.user.name}! Signed in with Google.`);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err.message || "Google sign-in failed. Please try again.";
      setGoogleError(msg);
      toast.error(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  }

  // ── Loads the GIS one-tap / button renderer when client ID is present ────
  function handleGoogleButtonClick() {
    if (!hasClientId) {
      toast.error("Google Client ID is not configured. See .env file.");
      return;
    }
    setIsGoogleLoading(true);
    setGoogleError(null);

    // Use Google Identity Services renderButton / prompt approach via the window object
    // The GoogleOAuthProvider already loaded the GIS script.
    const google = (window as any).google;
    if (!google?.accounts?.id) {
      toast.error("Google Identity Services failed to load. Refresh and try again.");
      setIsGoogleLoading(false);
      return;
    }

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: { credential: string; select_by: string }) => {
        handleGoogleCredential(response.credential);
      },
      cancel_on_tap_outside: true,
    });

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: open standard OAuth popup
        startGoogleLogin();
      }
    });
  }

  // Email/password login was removed in favor of exclusive Google OAuth

  return (
    <main className="relative flex min-h-dvh flex-col lg:flex-row items-center justify-center px-4 pt-24 pb-20 gap-8">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card/85 p-8 shadow-card backdrop-blur-md"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">Sign in to your smart city workspace.</p>

        {/* ── Google OAuth button ── */}
        <button
          id="google-login-btn"
          type="button"
          onClick={handleGoogleButtonClick}
          disabled={isGoogleLoading}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> Signing in with Google...</>
          ) : (
            <><GoogleIcon /> Continue with Google</>
          )}
        </button>

        {/* ── Google error feedback ── */}
        {googleError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{googleError}</span>
          </div>
        )}

        {/* ── Setup notice when Client ID is missing ── */}
        {!hasClientId && (
          <p className="mt-2 text-center text-[11px] text-amber-600 dark:text-amber-400">
            ⚠ Google Client ID not set. Add <code>VITE_GOOGLE_CLIENT_ID</code> to your{" "}
            <code>.env</code> file.
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No account?{" "}
          <Link to="/contact" className="text-foreground underline-offset-2 hover:underline">
            Talk to sales
          </Link>
        </p>
      </motion.div>
    </main>
  );
}