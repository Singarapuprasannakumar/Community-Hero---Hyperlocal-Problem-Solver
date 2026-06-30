// tests/e2e/global-setup.ts
import { test as base } from '@playwright/test';

/**
 * Global Playwright fixture that adds robust runtime monitoring.
 * It fails the test immediately on any of the monitored conditions.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // --- Console errors & warnings ------------------------------------------------
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        throw new Error(`Console ${type}: ${msg.text()}`);
      }
    });

    // --- Page errors (uncaught exceptions) --------------------------------------
    page.on('pageerror', error => {
      throw new Error(`Page error: ${error.message}`);
    });

    // --- Unhandled promise rejections -------------------------------------------
    await page.exposeFunction('handleUnhandledRejection', (reason: unknown) => {
      throw new Error(`Unhandled Promise Rejection: ${JSON.stringify(reason)}`);
    });
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).addEventListener('unhandledrejection', (event: any) => {
        // @ts-ignore
        (window as any).handleUnhandledRejection(event.reason);
      });
    });

    // --- Failed network requests (4xx / 5xx) -----------------------------------
    page.on('requestfailed', request => {
      const failure = request.failure();
      const url = request.url();
      throw new Error(`Request failed: ${url} – ${failure?.errorText}`);
    });

    // --- Slow page loads (>2 s) -------------------------------------------------
    page.on('load', async () => {
      const timing = await page.evaluate(() => performance.timing);
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      if (loadTime > 2000) {
        throw new Error(`Page load time ${loadTime}ms exceeds 2000 ms`);
      }
    });

    // --- Hydration / React errors (simple heuristic) ---------------------------
    page.on('response', async response => {
      // Detect common hydration warnings in HTML bodies
      const ct = response.headers()['content-type'] || '';
      if (ct.includes('text/html')) {
        const body = await response.text();
        if (body.includes('Hydration') && body.includes('mismatch')) {
          throw new Error('Hydration mismatch warning detected');
        }
        if (body.includes('React error')) {
          throw new Error('React error detected in response body');
        }
      }
    });

    // --- Missing assets (404) ---------------------------------------------------
    page.on('response', response => {
      if (response.status() === 404) {
        const url = response.url();
        if (url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js)$/i)) {
          throw new Error(`Missing asset (404): ${url}`);
        }
      }
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
