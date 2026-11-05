# REPORT — 10X Shop (CORE)

## 1. Planned vs delivered

| Module | CORE requirement | Status | Where |
|---|---|---|---|
| React | Function components and typed props | Done | `src/components/**`, `src/pages/**` |
| React | `children` composition | Done | `PageContainer`, `EmptyState`, `CartSummary`, `Layout` via `<Outlet />` |
| React | `useState` and `useEffect` | Done | Catalog, Product, Cart, Checkout, Login, contexts |
| React | `map()` with stable `key` | Done | `ProductGrid`, `CartPage`, gallery thumbnails |
| React | Callback props | Done | `ProductCard` `onAdd`, `CartItemRow` `onQuantityChange` / `onRemove` |
| React | Controlled Login and Checkout forms | Done | `LoginPage`, `CheckoutPage` |
| React | React Router + one Layout route | Done | `src/routes/AppRoutes.tsx`, `src/components/layout/Layout.tsx` |
| React | Context for auth and cart | Done | `src/context/AuthContext.tsx`, `src/context/CartContext.tsx` |
| React | Immutable cart updates | Done | `CartContext.tsx` (`map`, `filter`, spread) |
| React | Error Boundary | Done | `src/components/ErrorBoundary.tsx` |
| TypeScript | Typed props, state and API data | Done | `src/types/**` |
| TypeScript | `strict`, no `any` | Done | `tsconfig.app.json`, `.oxlintrc.json` |
| TypeScript | Type guard for persisted cart | Done | `isCartState` in `src/utils/cart.ts` |
| TypeScript | `npm run typecheck` = 0 errors and really checks `src/` | Done | proven with a deliberate type error, see `DEBUG-LOG.md` |
| Tailwind | v4 integration without config file | Done | `vite.config.ts`, `src/index.css` |
| Tailwind | Utilities, grid/flex, hover/focus/disabled | Done | all pages and reusable components |
| Tailwind | Responsive grid at 480px / 1024px | Done | `ProductGrid.tsx` |
| Optimization | Responsive at 375px without horizontal scroll | Done | verified in headless Chromium, see section 3 |
| Optimization | Error Boundary + DEBUG-LOG | Done | `ErrorBoundary.tsx`, `DEBUG-LOG.md` |
| Optimization | Compatibility matrix + Lighthouse placeholder | Done | `COMPATIBILITY.md`, `docs/lighthouse/README.md` |
| Practical | README, PLAN, REPORT, deploy config, Git history | Done | repository root, `vercel.json` |

### Not done (on purpose)

FULL features are locked out of this scope: search, category filter, sorting, pagination, URL
state, reviews, related products, promo codes, dark mode, Orders, Profile, Formik/Yup, lazy
routes, `@theme`, generics, OOP models. CORE was completed first, as required.

## 2. Metrics

| Metric | Value |
|---|---|
| `npm run build` output JS | 290.83 kB (89.31 kB gzip) |
| `npm run build` output CSS | 21.55 kB (5.07 kB gzip) |
| TypeScript / Oxlint errors | 0 / 0 |
| Automated CORE browser checks | 33 / 33 passed (Chromium headless) |
| Additional edge-case browser checks | 18 / 18 passed (Chromium headless) |
| Targeted failure/responsive checks | 7 / 7 passed (Chromium headless) |
| Requirement audit (header, grid, focus, hover, zero stock, totals) | 23 / 23 passed (Chromium headless) |
| Lighthouse mobile score | TODO(student): capture on the deployed URL |
| Commit count | TODO(student): `git rev-list --count HEAD` |
| Issues / pull requests | TODO(student): create them in the GitHub repository |

The bundle numbers come from the local production build on the day this report was written.
They will change slightly if the code changes.

## 3. What was verified and what was not

### Verified with commands

- `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` all exit successfully.
- `npm run typecheck` really covers `src/`: a deliberately invalid file failed the check and
  passed the root `tsc --noEmit` (which checks nothing because of project references).
- Automated browser flow in headless Chromium (`playwright-core` + system Chromium, kept outside
  the repository): catalog → product → cart → guest checkout → login → checkout → confirmation,
  badge updates, persistence, logout, malformed `localStorage`, invalid product ids, unknown
  routes, 375px overflow, mobile menu and stock limits.
- Targeted failure checks: blocking `dummyjson.com` shows a readable error (not `Failed to
  fetch`), the discounted price matches the formula, and the checkout form has no horizontal
  overflow at 375px with 44px inputs.
- Error Boundary fallback: a temporary `throw` in `CatalogPage` showed
  "Something went wrong." and the "Reload" button; the throw was removed afterwards.

### Must be verified by the student

- Firefox desktop and mobile emulation (the automated run used Chromium only).
- Lighthouse before/after on the deployed URL, and the screenshots in `docs/lighthouse/`.
- A real device check at 375px, including touch targets.
- The deployed URL and direct refresh of `/products/5` on Vercel.
- The browser tests listed in `COMPATIBILITY.md`.

## 4. Three hardest problems

1. **A typecheck that checked nothing.** The root `tsconfig.json` only contains project
   references. `tsc --noEmit` at the root exited 0 even with a broken file. The fix was to point
   the script at `tsconfig.app.json` and prove the failure with a temporary invalid file. This is
   a silent quality risk, not just a configuration detail.
2. **Login redirect race.** After logging in from `/checkout`, the URL became `/` instead of
   `/checkout`: the "already logged in" guard rendered `<Navigate to="/" />` while the submit
   handler tried to return to the protected page. The fix tracks whether the form was submitted
   and only auto-redirects before a submit. Reproduced and verified with a browser test.
3. **TypeScript narrowing across a closure.** `product` was checked for `null` in the render
   body, but `handleAdd` (a nested function) still saw `Product | null`. The fix captures a
   non-null `currentProduct` after the guard; the page was then split into a keyed
   `ProductDetails` child so changing `:id` resets the gallery, quantity and fetch state.

## 5. What I would do differently

- Set up the typecheck and lint gate before writing UI code, so configuration bugs are caught
  on an empty project.
- Write the browser smoke test at the start of the cart/checkout phase instead of after the
  first complete implementation; it found the redirect bug immediately.
- Add a small local JSON fallback for DummyJSON earlier, so the catalog demo does not depend on
  a third-party service during the defense.

## 6. AI usage summary

AI was used as a pair programmer for scaffolding, implementation drafts, test scripts and
documentation structure. I accepted its help for repetitive Tailwind markup and the initial
folder structure. I rejected suggestions to add FULL features (search, promo codes, reducer,
API client classes) because the scope was CORE only. I also rejected "just disable the rule"
workarounds: the redirect race and the effect warning were fixed in the code, not silenced.
Every command in the verification section was actually run in this repository, and no Lighthouse
score, commit hash, browser result or hour count was invented. The student still has to read,
understand and defend every file.

## 7. Student TODO list (exact order)

1. **Done:** public repository `Omadzelevan/10x-last` exists and the code is pushed.
2. Deploy to Vercel (settings in `README.md`).
3. Open `/products/5` directly on the live URL and refresh it; SPA rewrite must work.
4. Put the live URL into `README.md` (replace the `TODO(student): URL` line).
5. Capture Lighthouse mobile before/after on the live URL (`docs/lighthouse/README.md`).
6. Fill `COMPATIBILITY.md` with real Chrome and Firefox results (desktop + mobile emulation).
7. Replace the remaining `TODO(student)` markers: Lighthouse scores and commit/issues counts.
8. Create a few real GitHub Issues/PRs if the course requires them.
9. Submit the repository link before **6 Nov 2026, 23:59 (Georgia time)**.

