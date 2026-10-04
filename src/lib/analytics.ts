/**
 * Minimal analytics abstraction. No provider is wired yet; events go to any
 * registered sink (and to the console in development).
 *
 * Privacy rule enforced by the types: events carry property identifiers and
 * funnel steps only. Never add names, emails, phone numbers, or free text.
 */
type EventMap = {
  property_viewed: { propertyId: string };
  property_selected: { propertyId: string; via: "list" | "marker" | "carousel" };
  map_marker_clicked: { propertyId: string };
  filters_changed: { budget: string; size: string; area: string; results: number };
  lead_form_started: { propertyId: string };
  lead_form_step_completed: { propertyId: string; step: number };
  lead_submitted: { propertyId: string };
};
