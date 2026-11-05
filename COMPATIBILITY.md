# COMPATIBILITY — 10X Shop

This matrix must be completed by the student on real browsers and on the deployed URL.
The automated checks in this repository used headless Chromium only, so Firefox cells are
intentionally `TODO`.

Legend: `✓` works · `issue: … → fix: …` describes a real problem and its fix.

## Desktop

| Page / flow | Chrome (desktop) | Firefox (desktop) |
|---|---|---|
| `/` Catalog: load, 12 cards, add to cart | TODO(student) | TODO(student) |
| `/products/:id`: gallery, stepper, add to cart | TODO(student) | TODO(student) |
| `/cart`: quantity, remove, clear, totals | TODO(student) | TODO(student) |
| `/login`: validation errors, successful login | TODO(student) | TODO(student) |
| `/checkout`: guard, validation, place order, confirmation | TODO(student) | TODO(student) |
| `/products/abc`, `/products/999999`, `/whatever` → 404 | TODO(student) | TODO(student) |
| Direct refresh of `/products/5` on the deployed URL | TODO(student) | TODO(student) |
| Cart survives refresh; login does not | TODO(student) | TODO(student) |

## Mobile emulation (375 × 812)

| Page / flow | Chrome (mobile emulation) | Firefox (mobile emulation) |
|---|---|---|
| No horizontal scroll on any page | TODO(student) | TODO(student) |
| Burger menu opens/closes, `aria-expanded` changes | TODO(student) | TODO(student) |
| Tap targets ≥ 44px | TODO(student) | TODO(student) |
| Product grid is 1 column at 375px, 2 from 481px, 4 above 1024px | TODO(student) | TODO(student) |
| Checkout form and summary stack vertically | TODO(student) | TODO(student) |

## Notes

- Record the browser version and operating system next to each result.
- For any issue, write the symptom and the actual fix in the cell; do not write "works" without
  checking the deployed URL.
- Suggested screenshots: `docs/compat/chrome-catalog.png`, `docs/compat/firefox-checkout.png`.
