---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/properties/[slug]/page.tsx","src/app/properties/[slug]/apply/page.tsx"]
---

# Surface: Discovery funnel (map → lot → apply → confirmation)

Scope: `/` discovery map, `/properties/[slug]`, `/properties/[slug]/apply`, confirmation. Visitor mode: Persuade (the action is the working map search and "Make it yours").

Audience/job: U.S. visitor, often on a phone, checking whether owning land is really within reach. Proof available: the map, real Santa Cruz photography (illustrative, credited), transparent numbers. No testimonials, no claims.

Constraints: brief-pinned split layout (list left, map right on desktop), one sans-serif, natural palette (earth, vegetation, stone, off-white paper, charcoal), no urgency, demo data labeled.

Direction chosen unattended: the founder asked for no interruptions, so the assigned roll was built without a decision page.

## Direction contract

THESIS: Owning land starts with walking it and finding its corner stakes. Every lot is a staked, measurable place on a real map: price tags planted on stakes, and the lot you are looking at flagged in tajibo pink and drawn to scale. Refuses the classifieds photo grid and the generic-pin map clone.

OWN-WORLD: Stone-paper ground, a recolored topographic basemap in vegetation greens and stone, deep monte green for actions, charcoal ink, hairline plat rules, square-ish 6px corners. Tajibo pink exists only for "the one you're looking at": the flag, the parcel outline, its corner stakes, the selection rail. Archivo alone, expanded widths for prices and lot numbers (plat lettering), normal width for UI text.

STORY: Land on the map, see monthly prices sitting on real places around Santa Cruz, tap one, read size, total and monthly together, open the lot, see it to scale with its stakes, follow the plan arithmetic, press "Make it yours" with the lot carried through three short steps to a calm confirmation.

FIRST VIEWPORT: Desktop: 56px bar (wordmark, Explore, How it works, "Find your land"). Left panel about 40%: "Find your place." with lot count, three filter chips, scrolling image-led lot entries with no card boxes. Right: full-height map, staked price tags, selected lot as a pink flag with an anchored preview. Mobile: map fills the screen, filter chips float on top, snap carousel of lots at the bottom, List toggle.

FORM: Surveyor's boundary stakes and flagging tape, #4 of the ordered list; seed key ac7c2821. Signature interaction: planting the flag (selecting turns the tag into a flag and, at zoom ≥ 14, reveals the parcel to scale with corner stakes). Raises: plan arithmetic shown as a cross-check (from the night six-pack); the chosen lot rides every step (from terminal wayfinding); filter options preview resulting counts (from the algorave floor); pink reserved for focus only (from the luminescent understory); monumental lot number (from the kit wall); green owns whole regions, not accents (from coiled earth).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
