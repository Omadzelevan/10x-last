# PLAN — 10X Shop (CORE)

## 1. Goal

Build "10X Shop", an individual graduation project: a responsive e-commerce SPA on
Vite + React 19 + TypeScript (strict) + React Router + Tailwind CSS v4. Product data
comes from the public DummyJSON API. Login and checkout are local simulations; there is
no real authentication, payment or `POST` request.

## 2. Scope

| Module | CORE (planned and delivered) | FULL (not planned) |
|---|---|---|
| React | Function components, props, `children`, callback props, `useState`, `useEffect`, `map()` + stable `key`, controlled Login/Checkout, React Router, Context, immutable cart updates, Error Boundary | Custom hooks, reducer cart, lazy routes, reviews, related products |
| TypeScript | Typed props/state/API data, `strict`, type guards, zero `any`, typecheck = 0 errors | Generics, `ApiClient`/`ApiError`, OOP classes |
| Tailwind CSS | v4 via `@tailwindcss/vite`, `@import "tailwindcss";`, utilities, responsive grid, hover/focus/disabled variants | `@theme`, dark mode, custom utilities |
| Optimization | Responsive at 375px, Error Boundary, real debugging log, compatibility matrix, Lighthouse placeholder | Lazy images/routes, memoization, Lighthouse before/after report |
| Practical | README, PLAN, REPORT, deploy config, meaningful Git history | Orders, Profile, promo code, theme |

## 3. Three-week plan

| Week | Dates | Focus |
|---|---|---|
| W1 | 17–23 Oct | Project setup, strict TypeScript, Tailwind v4, Layout, routing, Login + AuthContext, Catalog |
| W2 | 24–30 Oct | Product details, CartContext, Cart page, Checkout, local order confirmation |
| W3 | 31 Oct – 6 Nov | Responsive pass, interactive states, QA, deploy, README/REPORT/DEBUG-LOG, final submission |

## 4. WBS epics and estimates

| Epic | Tasks | Estimate | Definition of Done |
|---|---|---|---|
| Auth | AuthContext, Login form + validation, ProtectedRoute | 6 h | Guest is redirected to `/login` with `from`; valid login returns to the protected page; logout returns to guest state and keeps the cart |
| Catalog | Product types, API functions, Catalog, ProductCard/Grid, loading/error/empty | 8 h | `/products?limit=12&skip=0` renders 12 typed cards with stable keys; loading, error and empty states are visible; add-to-cart updates the badge |
| Product | Product details, gallery, quantity stepper, add to cart feedback | 6 h | `/products/:id` loads and refreshes on id change; gallery and stepper work; stock limits and inline feedback are enforced; invalid ids show NotFound |
| Cart | CartContext + persistence, Cart page, quantity/remove/totals | 7 h | Quantity, remove and clear update totals and the badge immediately; the cart survives refresh; malformed storage is ignored |
| Checkout | Guard, controlled form + validation, order summary, confirmation | 6 h | Four exact fields validate; placing an order shows the confirmation without triggering the empty-cart redirect; the cart is cleared |
| Quality | Tailwind responsive pass, a11y, Error Boundary, debugging, typecheck/lint/build | 8 h | 375px has no overflow and 44px tap targets; focus/hover/disabled states work; Error Boundary fallback is demonstrated; all commands pass |
| Docs | PLAN, README, REPORT, DEBUG-LOG, COMPATIBILITY, deploy config | 5 h | Every document exists with real data; deploy config is present; `TODO(student)` marks everything the student must verify |

## 5. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | DummyJSON is unavailable or rate-limited | Show a readable error state; keep product data access isolated in `src/api/products.api.ts` so a local JSON fallback can be added |
| R2 | Tailwind v4 setup differs from v3 examples | Use the official `@tailwindcss/vite` plugin and `@import "tailwindcss";`; no `tailwind.config.js`, no PostCSS config |
| R3 | `tsc --noEmit` at the root silently checks nothing because of project references | Point `npm run typecheck` at `tsconfig.app.json` and prove it catches a deliberate type error |
| R4 | Responsive layout overflows at 375px | Mobile-first utilities, no fixed widths, burger navigation, explicit 375/768/1280 checks |
| R5 | Time lost to FULL features before CORE is complete | FULL scope is locked; only CORE is implemented |

## 6. Definition of Done

- `npm install && npm run typecheck && npm run lint && npm run build` pass with 0 errors.
- Catalog → Product → Add to cart → Cart → Checkout → Login → Confirmation works.
- Cart survives refresh; login does not. Logout keeps the cart.
- Invalid product ids and unknown routes render the NotFound page without crashing.
- Every page is usable at 375px with no horizontal scroll; tap targets are at least 44px.
- Docs exist and contain no fabricated data.
