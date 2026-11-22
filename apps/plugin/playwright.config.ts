import { defineConfig, devices } from '@playwright/test';

/**
 * Orbit's web build in Chromium: the plugin as orbit.soundor.dev plays it,
 * with the browser's layout, hit testing and input, which the integration
 * tests' simulated runtime does not have. `pnpm test:e2e` builds it first
 * (turbo.json).
 */
export default defineConfig({
  testDir: './e2e/web',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['github']] : 'list',
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve.ts 4174',
    url: 'http://localhost:4174/',
    reuseExistingServer: !process.env['CI'],
  },
});
