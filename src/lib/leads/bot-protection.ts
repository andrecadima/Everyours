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

export async function checkSubmitter(input: BotCheckInput): Promise<BotVerdict> {
  if (input.honeypot) return "bot";
  if (input.elapsedMs < MIN_FILL_MS) return "bot";
  return (await verifyChallenge(input.turnstileToken, input.clientIp)) ? "human" : "challenge_failed";
}

export const challengeEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY);

async function verifyChallenge(token: string | undefined, ip: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Fail closed when a configured challenge cannot be verified.
    return false;
  }
}
