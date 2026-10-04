---
name: Everyours
description: A piece of paradise. Forever yours. Map-first land discovery in Santa Cruz, Bolivia.
colors:
  stone-paper: "#f3f2ec"
  surface: "#fbfbf8"
  ink: "#1b201d"
  ink-2: "#4d5550"
  ink-3: "#646b66"
  line: "#e2e0d8"
  line-strong: "#8b877a"
  stone: "#cfccc1"
  monte: "#1f4a37"
  monte-deep: "#163628"
  monte-soft: "#e3eae2"
  monte-ink: "#e9efe7"
  leaf: "#5e8a5f"
  earth: "#8a5a3b"
  earth-soft: "#efe6da"
  tajibo: "#c22f6c"
  tajibo-deep: "#9e2154"
  tajibo-soft: "#f7dfe9"
  danger: "#b3261e"
  danger-soft: "#fbeceb"
  map-land: "#ecebe3"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3.6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  heading:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  plat-price:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  plat-tag:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
rounded:
  xs: "3px"
  sm: "6px"
  md: "10px"
spacing:
  gutter-mobile: "16px"
  gutter: "24px"
  stack: "20px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.monte}"
    textColor: "{colors.stone-paper}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.monte-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-on-green:
    backgroundColor: "{colors.stone-paper}"
    textColor: "{colors.monte-deep}"
    rounded: "{rounded.sm}"
    height: "52px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "48px"
  filter-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  filter-chip-active:
    backgroundColor: "{colors.monte}"
    textColor: "{colors.stone-paper}"
  price-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.plat-tag}"
    rounded: "{rounded.sm}"
    height: "28px"
  price-tag-flag:
    backgroundColor: "{colors.tajibo}"
    textColor: "#ffffff"
  payment-plan:
    backgroundColor: "{colors.monte}"
    textColor: "{colors.stone-paper}"
    rounded: "{rounded.md}"
    padding: "28px"
---

# Design System: Everyours

## Overview

**Creative North Star: "The staked lot"**

Owning land starts with walking it and finding its corner stakes. Everyours renders every listing as a staked, measurable place on a real map: price tags planted on stakes across a recoloured topographic basemap of Santa Cruz, and the lot you are looking at flagged in tajibo pink and drawn to scale. The interface is calm stone-paper and charcoal so the place, the photography, and the numbers carry the emotion; deep "monte" green owns whole regions where commitment happens.

The system refuses the land-classifieds grid, generic pin maps, luxury gold, crypto gloss, gradients, urgency, and any copy that promises returns. Affordability is never shown without the total price beside it.

**Key Characteristics:**
- Map first: land is visible in the first second, prices sit on real places.
- One sans (Archivo); expanded widths are reserved for numbers people compare.
- Pink means "the one you're looking at", nothing else.
- Green fields, not green accents: the plan, the confirmation, the primary action.
- Honest labels everywhere demo data or illustrative photos appear.

## Colors

### Primary
- **Monte** `#1f4a37` (deep subtropical forest green): primary buttons, the payment-plan field, the confirmation page ground, focus rings, active filter chips, progress segments. **Monte deep** `#163628` for hover and dark text on light green. **Monte soft** `#e3eae2` for status chips and quiet notes; **monte ink** `#e9efe7` for secondary text on green.

### Secondary
- **Tajibo** `#c22f6c` (the pink of Santa Cruz's tajibo trees and of survey flagging tape): the selected marker flag, the selected parcel outline and corner stakes, the selection ring on list and carousel cards, the inline flag beside a chosen lot. **Tajibo deep** `#9e2154` for the flag pole and borders.

### Tertiary
- **Earth** `#8a5a3b` on **earth soft** `#efe6da`: demo-listing badges, reserved-lot notices, the development-only banner. Informational, never decorative.

### Neutral
- **Stone-paper** `#f3f2ec` page ground; **surface** `#fbfbf8` raised surfaces, inputs, popovers; **ink** `#1b201d` text; **ink-2** `#4d5550` secondary text (6.9:1 on paper); **ink-3** `#646b66` tertiary text (4.9:1); **line** `#e2e0d8` hairlines; **line-strong** `#8b877a` input and chip borders (3.2:1, meets non-text contrast); **map land** `#ecebe3` basemap ground.

### Named Rules
**The Flag Rule.** Tajibo pink marks only the lot the visitor is looking at or has chosen. Never use it for decoration, alerts, or emphasis.

**The Field Rule.** Green is applied as a field that owns a region (the plan card, the confirmation page), not sprinkled as accents.

## Typography

**Archivo** (variable, with width axis) is the only family. Normal width for reading and UI; the `plat` treatment (`font-stretch: 118%`, tabular figures) for prices, totals, lot numbers, and map tags, like the lettering on a survey plat.

### Hierarchy
- **Display** 2.5–4.75rem, 600, line-height 0.95, tracking -0.035em: property names, How it works.
- **Heading** 1.75–2rem, 600, tracking -0.025em: "Find your place.", form step questions.
- **Title** 1.0625–1.25rem, 600: section headings, lot names in lists.
- **Body** 1rem / 1.55; **body small** 0.9375rem; meta 0.8125–0.875rem in ink-3.
- **Plat price** 3.25rem on the plan; 1.25–1.375rem in lists; 13px on map tags.

### Named Rules
**The Number Rule.** Every price and area uses tabular figures; monthly and total always appear together.

## Layout

Discovery is a split screen on desktop (results panel `minmax(24rem, 42%)`, map fills the rest, both full height under a 56px bar). Below 1024px it becomes map-first: filters float at the top, a snap carousel of lots sits at the bottom, and a "View list" toggle swaps to the full list. Content pages use a 78rem container with 16px/24px gutters; the property page is a two-column grid (content + 25rem sticky plan) that reorders on phones to intro, plan, details. Body measure stays under ~62ch. Sticky mobile CTA bars respect the safe area.

## Elevation & Depth

Flat by default; depth only where something floats over the map or content.

### Shadow Vocabulary
- **lift** `0 1px 2px rgb(27 32 29 / .06), 0 8px 24px -8px rgb(27 32 29 / .18)`: chips and buttons floating on the map.
- **float** `0 2px 4px rgb(27 32 29 / .08), 0 18px 40px -12px rgb(27 32 29 / .28)`: map preview popup, carousel cards, popovers.
- **plan** `0 24px 48px -28px rgb(22 54 40 / .7)`: the payment-plan field.

## Shapes

Square-ish corners, like stakes and plats: 3px for badges, 6px for buttons, inputs, chips, images and tags, 10px for floating panels. Hairline 1px rules separate data rows. The only round shapes are radio dots and collapsed marker heads.

## Components

### Buttons
Primary is monte with paper text (44px; 52px large); secondary is surface with a line-strong border; on green fields the primary inverts to paper with monte-deep text. Labels are verbs that name the result: "Make it yours", "Send my interest", "Keep exploring".
