# Everyours

**A piece of paradise. Forever yours.**

Everyours helps people discover land in Santa Cruz, Bolivia that can be acquired through accessible monthly payment plans. This repository is the first MVP: a map-first discovery experience that turns interest in a specific lot into a stored lead for the Everyours team.

> All listings in this MVP are **fictional demo data** (`isDemo = true`, reference codes `DEMO-SCZ-…`). Photos are real, credited landscape photography used as illustration (see `/credits`), not photos of the listed lots.

## MVP scope

One funnel, built end to end:

**Discover → Explore → Select → Apply → Lead captured**

| Step | Where | What happens |
| --- | --- | --- |
| Discover | `/` | Split screen on desktop (results + map); map-first with a swipeable lot carousel on phones. Price tags are planted on the map. |
| Explore | `/` | Three filters (monthly budget, lot size, area) update the list and the markers together; each option previews how many lots it leaves. |
| Select | `/` | Clicking a marker raises a pink flag, highlights the lot in the list, and opens a preview. "To scale" zooms until the lot outline is drawn at its real size. |
| Property | `/properties/[slug]` | Gallery, monthly + total price, the example plan's arithmetic (down + months × monthly = total), attributes, and a map that flies down to the lot outline. |
| Apply | `/properties/[slug]/apply` | Three short steps with a progress indicator. The chosen lot travels with the visitor; it is never re-selected. |
| Confirmation | `/properties/[slug]/apply/thanks` | "This could be yours." Clear that an inquiry is not a reservation. |

Also included: `/how-it-works`, placeholder `/privacy` and `/terms`, `/credits`, a development-only lead viewer at `/admin/leads`, Open Graph image, and `robots.txt`.

Deliberately **not** built: payments, financing, credit checks, accounts, reservations, CRM, chat, CMS, admin dashboard.

## Tech stack

- **Next.js 16** (App Router, Turbopack, React 19.2, Server Components and a Server Action for leads)
- **TypeScript**, **Tailwind CSS v4** (design tokens in `src/app/globals.css`), Radix primitives (popover) in the shadcn style
- **PostgreSQL 17** via Docker Compose, **Prisma 7** (`prisma-client` generator + `@prisma/adapter-pg`)
- **Zod 4** + **React Hook Form** (one schema shared by client and server)
- **MapLibre GL 6** with **OpenFreeMap** vector tiles (OpenStreetMap data, no API key), recolored to the brand, plus terrain relief from open elevation tiles
- **Playwright** (end-to-end) and Node's built-in test runner (unit)

## Prerequisites

- Node.js **20.9+** (developed on Node 26)
- Docker (for the local database). Any Postgres 14+ works if you prefer your own; just set `DATABASE_URL`.

## Quick start

```bash
cp .env.example .env     # defaults work as-is for local development
npm install              # also generates the Prisma client and copies the map worker
npm run setup            # starts Postgres (Docker), applies migrations, seeds demo data
npm run dev              # http://localhost:3000
```

If port 3000 is already in use on your machine, run `npx next dev -p 3100` instead.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://everyours:everyours@localhost:5433/everyours?schema=public` | Postgres connection (Docker maps container 5432 to host **5433**). |
| `NEXT_PUBLIC_MAP_STYLE_URL` | No | empty (OpenFreeMap) | Any MapLibre style URL. Use only public, domain-restricted keys: `NEXT_PUBLIC_` values reach the browser. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | No | empty | Cloudflare Turnstile. When both are set, the form shows the widget and the server verifies every submission. |
| `ENABLE_DEV_ADMIN` | No | `false` | `/admin/leads` has no authentication; it 404s in production unless this is `true`. Add real auth before enabling it. |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:3000` | Canonical / Open Graph base URL. |

No secrets are committed; `.env` is git-ignored.

## Database

```bash
npm run db:up        # start Postgres in Docker (container: everyours-db)
npm run db:migrate   # create/apply a migration while developing (prisma migrate dev)
npm run db:deploy    # apply existing migrations (prisma migrate deploy)
npm run db:seed      # replace demo properties (leads on demo lots are removed too)
npm run db:reset     # drop, re-migrate, re-seed
npm run db:down      # stop the container (data persists in the everyours-db volume)
```

Schema: `prisma/schema.prisma`
- **Property**: slug, name, lot label, reference code, description, area/municipality/department/country, coordinates, size, total price, monthly-from, down payment, term, status (`AVAILABLE` | `RESERVED` | `SOLD`), featured, road access, terrain, utilities[], `isDemo`.
- **PropertyImage**: url, alt, sort order, credit + credit URL, `isIllustrative`.
- **Lead**: property, first/last name, email, phone (normalized, e.g. `+15125550142`), country (ISO code), preferred contact method, budget range, message, `consentAt`, status (default `NEW`), source (default `WEB_MVP`), and a unique `submissionKey` for idempotency.

**Adding real inventory:** insert `Property` rows with `isDemo: false` and surveyed coordinates. Nothing in the UI needs to change. The map draws an approximate square outline from the lot's area; replace `src/lib/lot-geometry.ts` with surveyed polygons when you have them.

## Testing

```bash
npm test                     # unit: lead validation, phone normalization, filters
npm run test:e2e:install     # once: download Playwright's Chromium
npm run test:e2e             # end-to-end; starts `next dev` on :3210 automatically
E2E_BASE_URL=http://localhost:3000 npm run test:e2e   # or reuse a running server
npm run lint
npm run typecheck
npm run build
```

The end-to-end suite covers: discovery renders 10 lots and 10 markers with no console errors; filters update list and markers, preview counts, and reset; empty results explain themselves; marker ↔ list selection sync; the property page price/plan; a helpful **404** for unknown lots; reserved lots inviting interest; the complete lead flow (validation on each step, consent required and unchecked, double-click submission) with a direct database check that exactly one correct `NEW`/`WEB_MVP` lead was stored; and the mobile map, carousel, list toggle, and sticky CTA.

## Architecture

```
prisma/
  schema.prisma, migrations/, seed.ts        demo data (coordinates checked against OSM)
  data/image-credits.json                    photo licenses (rendered on /credits)
src/
  app/
    (discovery)/page.tsx, loading.tsx        "/" — server component loads listings
    properties/[slug]/…                      property page, apply, thanks
    how-it-works, privacy, terms, credits, admin/leads
    opengraph-image.tsx, icon.svg, robots.ts
  components/
    discovery/   discovery (state + sync), filter-bar, property-entry, lot-carousel, map-preview
    map/         property-map (MapLibre, markers, lot outlines, fallback), map-style (recolor + relief)
    property/    gallery, payment-plan, property-facts, lot-map, property-photo (fallback)
    lead/        lead-form (3 steps), form-controls, selected-lot, turnstile
    site/        header, footer, logo, legal layout;  ui/button
  lib/
    properties.ts (server queries → plain DTOs), property-types.ts, filters.ts, format.ts,
    lot-geometry.ts, analytics.ts, countries.ts, db.ts
    leads/ schema.ts (shared Zod), submit-lead.ts (server action), rate-limit.ts, bot-protection.ts
scripts/copy-maplibre-worker.mjs             serves MapLibre's web worker from /public
tests/ e2e/ (Playwright), unit/ (node:test)
```

Key decisions:
- **Server-first.** Listings and property pages are server components reading Prisma at request time (`connection()`), so builds don't need a database. Only the map, filters, and form ship client JavaScript; MapLibre loads on demand.
- **One validation schema.** `src/lib/leads/schema.ts` drives each form step and is re-run in the server action. The server also normalizes input, applies a honeypot plus a minimum fill time (bots get a silent "success" and nothing is stored), optional Turnstile, a per-client rate limit (5 per 10 minutes, IP hashed in memory), idempotency by `submissionKey`, and a 10-minute same-email-same-lot duplicate guard. Errors returned to the browser never include internals, and server logs never include personal data.
- **Analytics** (`src/lib/analytics.ts`): typed events `property_viewed`, `property_selected`, `map_marker_clicked`, `filters_changed`, `lead_form_started`, `lead_form_step_completed`, `lead_submitted`. They carry IDs and steps only, never PII. No provider is connected; call `registerAnalyticsSink()` to add one.
- **Graceful degradation.** If the map style or WebGL fails, the map shows a retry message and phones switch to the list. Broken photos fall back to a branded placeholder. A database outage shows an on-brand error page with retry.
- **Design system.** See `DESIGN.md` (tokens and rules) and `PRODUCT.md` (product truth).
