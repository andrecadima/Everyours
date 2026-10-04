import "server-only";

/**
 * Bot checks, cheapest first. Turnstile is verified only when its secret is
 * configured; without it the honeypot and timing checks still apply.
 * reCAPTCHA or another provider can be swapped in behind `verifyChallenge`.
 */
const MIN_FILL_MS = 2500;

export type BotCheckInput = {
  honeypot?: string;
  elapsedMs: number;
  turnstileToken?: string;
  clientIp?: string;
};

export type BotVerdict = "human" | "bot" | "challenge_failed";
