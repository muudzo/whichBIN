import { defineConfig, devices } from '@playwright/test'

// Smoke tests on real browser engines at phone sizes: Android Chrome and iPhone Safari (WebKit).
const RESPONSIVE = /responsive\.spec\.ts/

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'android-chrome', testIgnore: RESPONSIVE, use: { ...devices['Pixel 7'] } },
    { name: 'iphone-se-1st-gen', testIgnore: RESPONSIVE, use: { ...devices['iPhone SE'] } }, // 320 × 568, the smallest
    { name: 'iphone-se', testIgnore: RESPONSIVE, use: { ...devices['iPhone SE (3rd gen)'] } }, // 375 × 667
    { name: 'iphone-14', testIgnore: RESPONSIVE, use: { ...devices['iPhone 14'] } },
    // The responsive check (9 Nov) sets its own screen sizes, phones to big desktops, so it runs once per engine
    // instead of once per phone above.
    { name: 'responsive-chromium', testMatch: RESPONSIVE, use: { ...devices['Desktop Chrome'] } },
    { name: 'responsive-webkit', testMatch: RESPONSIVE, use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 120_000,
    // Blank Supabase settings win over app/.env.local, so the tests play on the local store
    // and never save test answers or scores in the real database.
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' },
  },
})
