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

export const leadFields = {
  firstName: name("first name"),
  lastName: name("last name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, { error: "That email is too long." })
    .pipe(z.email({ error: "Enter a valid email, like name@example.com." })),
  phone: z
    .string()
    .trim()
    .min(1, { error: "Enter a phone number so we can reach you." })
    .max(32, { error: "That phone number is too long." })
    .refine((v) => /^[+()\d\s.-]+$/.test(v), { error: "Use digits, spaces, and an optional +." })
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 7 && n <= 15;
    }, { error: "Enter a full phone number, including the area code." }),
  country: z.enum(COUNTRY_CODES, { error: "Choose your country." }),
  preferredContactMethod: z.enum(["WHATSAPP", "PHONE", "EMAIL"], { error: "Choose how we should contact you." }),
  monthlyBudgetRange: z
    .enum(["UNDER_150", "FROM_150_TO_250", "FROM_250_TO_400", "OVER_400", "NOT_SURE"])
    .optional(),
  message: z.string().trim().max(1000, { error: "Keep your message under 1,000 characters." }).optional(),
  consent: z.boolean().refine((v) => v, { error: "Please confirm we may contact you." }),
};

export const leadFormSchema = z.object(leadFields);
export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormValues = z.output<typeof leadFormSchema>;

/** The fields each step owns, in order. */
export const LEAD_STEPS = [
  { id: "about", title: "About you", fields: ["firstName", "lastName"] },
  { id: "contact", title: "How to reach you", fields: ["email", "phone", "country", "preferredContactMethod"] },
  { id: "plan", title: "Your plan", fields: ["monthlyBudgetRange", "message", "consent"] },
] as const satisfies ReadonlyArray<{ id: string; title: string; fields: ReadonlyArray<keyof LeadFormInput> }>;

/** What the server action receives: the form plus routing and anti-abuse fields. */
export const leadSubmissionSchema = leadFormSchema.extend({
  propertySlug: z.string().regex(/^[a-z0-9-]{1,120}$/),
  submissionKey: z.uuid(),
  /** Honeypot: humans never see or fill this. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** ms since the form rendered; bots submit instantly. */
  elapsedMs: z.number().int().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
});
export type LeadSubmission = z.input<typeof leadSubmissionSchema>;
