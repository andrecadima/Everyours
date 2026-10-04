import { defineConfig, devices } from "@playwright/test";

// Reuse a running server with E2E_BASE_URL, otherwise start `next dev` on 3210.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3210";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    // Software WebGL so the map renders in headless browsers and CI.
    launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npx next dev --port 3210", url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
