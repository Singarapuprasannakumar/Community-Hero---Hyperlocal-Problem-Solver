# Community Hero AI — Technical Architecture

This document outlines the codebase directories, state managers, and runtime execution models of **Community Hero AI**.

---

## 1. Directory Layout

```text
src/
├── components/          # Shared site buttons, logo, navbar
├── features/            # Core business domains
│   ├── ai/              # AI Runtime, replacement provider modules
│   ├── analytics/       # Executive command center, SVG charts
│   ├── community/       # Social feeds, RWA cleanup registries
│   ├── diagnostics/     # PWA status, accessibility controls
│   ├── dashboard/       # Sidebar, layouts
│   ├── enterprise/      # Live case queues, SLA trackers
│   ├── gis/             # Leaflet maps twin
│   └── issues/          # Wizards intake, comments boards
├── routes/              # TanStack Start file-based routing
└── shared/
    ├── services/        # Mock network transaction services
    ├── stores/          # Split Zustand state stores
    └── types/           # Type contracts
```

---

## 2. State & Store Decoupling

Rather than a single monolithic database model, states are strictly separated:
- **`useIssueStore`:** Incidents, detail files, verifications.
- **`useGISStore`:** Layer selections, viewport, active routes.
- **`useAnalyticsStore`:** Historical volumes metrics.
- **`useOfflineStore`:** Local queues for offline uploads.

---

## 3. Replaceable AI Runtime

All AI operations resolve via an interface:
```typescript
export interface AIProvider {
  analyzeIssue(payload: any): Promise<AIAnalysisResult>;
}
```
Switching from mock APIs to real OpenAI/Gemini endpoints only requires updating the provider key in `.env.production` and matching the class interface.
