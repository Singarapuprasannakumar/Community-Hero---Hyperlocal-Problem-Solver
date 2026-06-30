import { test, expect } from '@playwright/test';

const routes = [
  '/dashboard',
  '/dashboard/issues',
  '/dashboard/map',
  '/dashboard/community',
  '/dashboard/analytics',
  '/dashboard/admin',
  '/dashboard/diagnostics',
];

for (const route of routes) {
  test(`Load ${route} without console errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`${msg.type()}: ${msg.text()}`);
      }
    });

    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();

    // Wait a short while for any async errors
    await page.waitForTimeout(1000);
    expect(consoleErrors).toEqual([]);
  });
}
