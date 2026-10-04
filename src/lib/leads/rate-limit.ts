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

export function checkRateLimit(clientKey: string, now = Date.now()) {
  const recent = (hits.get(clientKey) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(clientKey, recent);
    return { ok: false as const, retryAfterMs: WINDOW_MS - (now - recent[0]) };
  }
  recent.push(now);
  hits.set(clientKey, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return { ok: true as const };
}
