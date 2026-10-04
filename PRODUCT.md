# Product

<!-- impeccable:product-schema 1 -->

> Source: inferred from the founder's written MVP brief (2026-10-04). The brief asked for autonomous execution without interview rounds, so every fact below is taken from that brief; items marked _(inferred)_ are reasonable readings not stated verbatim.

## Platform

web

## Stack

Pinned by the brief: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui where useful, PostgreSQL, Prisma, Zod, React Hook Form, MapLibre/OpenStreetMap-backed map. Local Postgres via Docker Compose.

## Users

Primarily U.S. consumers who assumed land ownership was financially out of reach. They arrive curious, often on a phone _(inferred: mobile-first was mandated)_, and want to see real-looking land, a price they can understand, and a low-pressure way to raise their hand.

The internal Everyours team is a secondary user: it receives leads and contacts people by WhatsApp, phone, or email.

## Product Purpose

Everyours helps people discover land in Santa Cruz, Bolivia that can be acquired through accessible monthly payment plans. The MVP has one funnel: Discover → Explore → Select → Apply → Lead captured. Success is a stored lead attached to the exact property the visitor chose, from a visitor who felt "I could actually own this."

## Positioning

Land ownership made radically approachable: a premium, map-first technology experience instead of a land-classifieds site, with the monthly amount and the full total price shown together, upfront.

## Operating Context

- Visitors browse an interactive map of the Santa Cruz region, select a lot, read its page, and submit a short 3-step interest form.
- The Everyours team follows up manually; an inquiry is never a reservation or a purchase.
- No payments, lending, underwriting, accounts, or reservations exist in the product.

## Capabilities and Constraints

- Map discovery with list/map sync and three filters (monthly budget, lot size, area).
- Property pages with gallery, total price, example payment plan, and attributes.
- Lead capture stored in Postgres with consent timestamp, status `NEW`, source `WEB_MVP`.
- Must stay usable when optional integrations (map tiles, bot protection) are unavailable.
- All seeded listings and imagery are demonstration data and must be labeled as such.

## Brand Commitments

- Name: **Everyours** (wordmark may be set lowercase: `everyours`).
- Tagline: "A piece of paradise. Forever yours."
- Supporting lines: "Land ownership, within reach." · "Find your place." · "Make it yours." · "Something real. Something yours."
- Primary CTA everywhere: **Make it yours**. Secondary: **I'm interested**.
- Voice: short, human, confident, warm; never desperate or predatory.
- Feel: premium, calm, optimistic, trustworthy, spacious, highly visual.
- Palette sources named by the founder: warm earth, tropical vegetation, natural stone, off-white paper, deep charcoal. One modern sans-serif typeface.
- Banned: guaranteed returns, appreciation, passive income, wealth, escaping employment, visas/residency, fake urgency, countdowns, dark patterns, cheap luxury gold, crypto aesthetics, generic corporate blue, giant gradients.

## Evidence on Hand

- No real listings, photography, testimonials, partners, press, or legal copy exist yet. Do not fabricate any of them.
- Demo properties are fictional and flagged `DEMO`; photography is illustrative stock, labeled as such.
- Privacy Policy and Terms are placeholders pending legal review.
