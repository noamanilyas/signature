import { defineConfig, devices } from "@playwright/test";

const APP_PORT = process.env.SIGNATURE_TEST_PORT || "4783";
const BASE_URL = process.env.SIGNATURE_TEST_BASE_URL || `http://127.0.0.1:${APP_PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    trace: "on",
    screenshot: "on",
    video: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node ./bin/www",
    cwd: "..",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
