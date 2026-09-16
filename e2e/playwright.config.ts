import { defineConfig, devices } from "@playwright/test";

const APP_PORT = process.env.SIGNATURE_TEST_PORT || "4783";
const BASE_URL = process.env.SIGNATURE_TEST_BASE_URL || `http://127.0.0.1:${APP_PORT}`;

// Playwright wipes the whole outputDir at the start of every run, regardless
// of test filters. Defaulting to a timestamped subfolder (instead of the
// bare "test-results") means each run gets its own dir, so results from a
// previous run survive. Set SIGNATURE_TEST_OUTPUT_DIR to pin a fixed path
// (e.g. in CI, where only the latest run's artifacts matter).
//
// This config is loaded fresh in the main process AND in each worker
// subprocess, so the timestamp is computed once and stashed in process.env
// — workers inherit it from the main process's env — rather than
// recomputed per load, which would otherwise split one run's artifacts
// across multiple sibling folders.
if (!process.env.SIGNATURE_TEST_OUTPUT_DIR) {
  process.env.SIGNATURE_TEST_OUTPUT_DIR = `./test-results/${new Date().toISOString().replace(/[:.]/g, "-")}`;
}
const OUTPUT_DIR = process.env.SIGNATURE_TEST_OUTPUT_DIR;

export default defineConfig({
  testDir: "./tests",
  outputDir: OUTPUT_DIR,
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
