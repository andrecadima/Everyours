import type { PropertySummary } from "@/lib/property-types";

// Three filters, each a single choice. "any" means the filter is off.

export const BUDGET_OPTIONS = [
  { value: "any", label: "Any budget", max: Infinity },
  { value: "150", label: "Up to $150/mo", max: 150 },
  { value: "200", label: "Up to $200/mo", max: 200 },
  { value: "300", label: "Up to $300/mo", max: 300 },
] as const;

export const SIZE_OPTIONS = [
  { value: "any", label: "Any size", min: 0, max: Infinity },
  { value: "small", label: "Under 500 m²", min: 0, max: 499 },
  { value: "medium", label: "500 – 1,000 m²", min: 500, max: 1000 },
  { value: "large", label: "Over 1,000 m²", min: 1001, max: Infinity },
] as const;

export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];
export type SizeValue = (typeof SIZE_OPTIONS)[number]["value"];

export type Filters = {
  budget: BudgetValue;
  size: SizeValue;
  /** An `area` value from the listings, or "any". */
  area: string;
};

export const DEFAULT_FILTERS: Filters = { budget: "any", size: "any", area: "any" };

export const isFiltered = (f: Filters) => f.budget !== "any" || f.size !== "any" || f.area !== "any";

export function matches(p: PropertySummary, f: Filters) {
  const budget = BUDGET_OPTIONS.find((o) => o.value === f.budget) ?? BUDGET_OPTIONS[0];
  const size = SIZE_OPTIONS.find((o) => o.value === f.size) ?? SIZE_OPTIONS[0];
  return (
    p.monthlyPriceFromUsd <= budget.max &&
    p.areaSquareMeters >= size.min &&
    p.areaSquareMeters <= size.max &&
    (f.area === "any" || p.area === f.area)
  );
}

export const applyFilters = (list: PropertySummary[], f: Filters) => list.filter((p) => matches(p, f));
