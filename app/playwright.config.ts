import { defineConfig, devices } from '@playwright/test'

// Smoke tests on real browser engines at phone sizes: Android Chrome and iPhone Safari (WebKit).
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'android-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'iphone-se-1st-gen', use: { ...devices['iPhone SE'] } }, // 320 × 568, the smallest
    { name: 'iphone-se', use: { ...devices['iPhone SE (3rd gen)'] } }, // 375 × 667
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
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
