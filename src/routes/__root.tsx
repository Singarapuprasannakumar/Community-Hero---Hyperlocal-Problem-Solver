import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "../components/site/navbar";
import { Footer } from "../components/site/footer";
import { useAccessibilityStore } from "../shared/stores/accessibility-store";
import { useOfflineStore } from "../shared/stores/offline-store";
import { AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../shared/stores/auth-store";
import { authService } from "../shared/services/auth-service";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Community Hero AI — The Operating System for Smart Communities" },
      { name: "description", content: "Citizen-powered, AI-triaged. Report, route and resolve community issues at city scale with vision models, predictive ETAs and transparent dashboards." },
      { name: "author", content: "Community Hero AI" },
      { property: "og:title", content: "Community Hero AI — The Operating System for Smart Communities" },
      { property: "og:description", content: "AI that turns citizen reports into measurable urban outcomes — detection, routing, ETA & cost prediction in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@CommunityHeroAI" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const { isOnline } = useOfflineStore();
  const { highContrast, dyslexicFont, textSize } = useAccessibilityStore();

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname.startsWith("/login");
  const isAuthPage = isDashboard || isLogin;

  const { isAuthenticated, login, logout } = useAuthStore();
  
  useEffect(() => {
    // Attempt to hydrate/validate session from cookies via API on mount
    authService.validateSession()
      .then(response => {
        login(response.user);
      })
      .catch(() => {
        // If session is invalid/expired, clear state
        if (isAuthenticated) {
          logout();
        }
      });
  }, [isAuthenticated, login, logout]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <div className={cn(
        "relative min-h-dvh bg-background text-foreground transition-all duration-300",
        highContrast && "contrast-double",
        dyslexicFont && "font-dyslexic",
        textSize === "large" && "text-lg",
        textSize === "huge" && "text-xl"
      )}>
        {/* Offline Banner alert */}
        {!isOnline && (
          <div className="bg-warning text-warning-foreground px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-1.5 z-50 sticky top-0 animate-pulse">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>Operating in Offline Mode. Actions are queued for synchronization.</span>
          </div>
        )}
        {!isAuthPage && <Navbar />}
        <Outlet />
        {!isAuthPage && <Footer />}
      </div>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
