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
