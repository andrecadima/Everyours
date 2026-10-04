import "server-only";
import { createHash } from "node:crypto";

/**
 * Sliding-window limiter kept in process memory. Good enough for one server
 * and local development; on serverless or multiple instances, back it with
 * Redis (e.g. Upstash from the Vercel Marketplace) behind this same function.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function hashClient(ip: string) {
  // Never keep raw IPs, even in memory.
  return createHash("sha256").update(`everyours:${ip}`).digest("hex").slice(0, 32);
}
