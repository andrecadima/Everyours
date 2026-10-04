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
