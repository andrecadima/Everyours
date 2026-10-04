import type { PropertySummary } from "@/lib/property-types";

// Three filters, each a single choice. "any" means the filter is off.

export const BUDGET_OPTIONS = [
  { value: "any", label: "Any budget", max: Infinity },
  { value: "150", label: "Up to $150/mo", max: 150 },
  { value: "200", label: "Up to $200/mo", max: 200 },
  { value: "300", label: "Up to $300/mo", max: 300 },
] as const;
