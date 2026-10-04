import { defineConfig, devices } from "@playwright/test";

// Reuse a running server with E2E_BASE_URL, otherwise start `next dev` on 3210.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3210";
