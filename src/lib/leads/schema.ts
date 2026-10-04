import { z } from "zod";
import { COUNTRY_CODES } from "@/lib/countries";

// One schema, used by the form (per step) and re-run on the server.

export const CONTACT_METHODS = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Phone call" },
  { value: "EMAIL", label: "Email" },
] as const;

export const BUDGET_RANGES = [
  { value: "UNDER_150", label: "Under $150/mo" },
  { value: "FROM_150_TO_250", label: "$150 – $250/mo" },
  { value: "FROM_250_TO_400", label: "$250 – $400/mo" },
  { value: "OVER_400", label: "$400+/mo" },
  { value: "NOT_SURE", label: "Not sure yet" },
] as const;

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `Enter your ${label}.` })
    .max(80, { error: `That ${label} is too long.` })
    .regex(/^[\p{L}\p{M}' .-]+$/u, { error: `Use letters only in your ${label}.` });

/** Strip formatting; keep a leading + for international numbers. */
export function normalizePhone(raw: string, country?: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (trimmed.startsWith("00")) return `+${digits.slice(2)}`;
  // A 10-digit U.S./Canada number typed without the country code.
  if ((country === "US" || country === "CA") && digits.length === 10) return `+1${digits}`;
  if ((country === "US" || country === "CA") && digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
}
