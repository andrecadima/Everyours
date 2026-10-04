import { z } from "zod";
import { COUNTRY_CODES } from "@/lib/countries";

// One schema, used by the form (per step) and re-run on the server.

export const CONTACT_METHODS = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Phone call" },
  { value: "EMAIL", label: "Email" },
] as const;
