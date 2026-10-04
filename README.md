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
