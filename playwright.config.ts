import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Aramancia Tracker.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',
    timeout: 60000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173/aramancia-tracker/',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173/aramancia-tracker/',
        reuseExistingServer: !process.env.CI,
    },
});
