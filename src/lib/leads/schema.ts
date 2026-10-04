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
