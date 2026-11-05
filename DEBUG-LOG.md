# DEBUG-LOG — real bugs found while building 10X Shop

All entries below were found in this repository during development. No dates or bugs were
invented. Add the real commit link to each `TODO(student)` after pushing.

## Bug 1 — `npm run typecheck` checked nothing

**Symptom.** `npm run typecheck` exited with code 0 even when `src/` contained an obvious type
error. The project looked healthy while a broken file could ship.

**Reproduction.**

1. Create `src/typecheck-probe.ts` with `const probe: number = "not a number"`.
2. Run `npx tsc --noEmit` at the repository root → exit code 0 (no output).
3. Run `npm run typecheck` → `TS2322: Type 'string' is not assignable to type 'number'`.

**Tool used.** Terminal (`tsc`, `npm run typecheck`) with a temporary probe file.

**Root cause.** The root `tsconfig.json` has `"files": []` and only project references.
Plain `tsc --noEmit` does not follow references (that requires `-b`), so it type-checked no
files at all. This is the Vite template's default project-reference setup.

**Fix.** `package.json` uses
`"typecheck": "tsc --noEmit -p tsconfig.app.json"`, which includes `src`. The probe was removed
after confirming both behaviours. `npm run build` still uses `tsc -b`.

**What I learned.** A green command is not proof. Always inject a deliberate error and confirm
that the gate fails; otherwise the gate may be checking nothing.

**Commit.** https://github.com/Omadzelevan/10x-last/commit/b923747f02ae03eb766e8145b62eeff26f236aca

## Bug 2 — Login sent the user to the catalog instead of back to checkout

**Symptom.** Guest opened `/checkout`, was redirected to `/login`, logged in successfully, but
landed on `/` instead of `/checkout`. The checkout flow was broken after authentication.

**Reproduction.**

1. With an empty `localStorage`, open `/cart`, add a product and click **Proceed to checkout**.
2. On `/login`, submit a valid username and a password of at least 6 characters.
3. Expected `/checkout`; actual URL was `/`.

**Tool used.** Headless Chromium driven by `playwright-core` (installed outside the project),
with a script that waits for `**/checkout` after submit.

**Root cause.** `LoginPage` had a guard `if (user) return <Navigate to="/" replace />`.
`login()` and `navigate(from)` were called in the same handler, but after the context update
re-rendered the page, the guard could win and navigate to `/`, overriding the intended
`from` destination. This is the double-redirect race mentioned in the specification.

**Fix.** `LoginPage` now tracks `hasSubmitted`. The "already logged in" redirect to `/` only
runs before a submit. After a successful submit the handler performs exactly one navigation:
`navigate(from ?? "/", { replace: true })`. Re-ran the browser test: the URL is `/checkout`
and the checkout form is visible.

**What I learned.** Redirect guards that depend on state changed by the same submit handler are
a race. Browser-level tests catch this; a manual click-through may hide it depending on timing.

**Commit.** https://github.com/Omadzelevan/10x-last/commit/ec9889ac511e55069fe978ed61cc118812ccb3f3

## Bug 3 — `ProductPage` failed typecheck: `'product' is possibly 'null'`

**Symptom.** After adding the null guard for a failed product request, `npm run typecheck`
reported `TS18047: 'product' is possibly 'null'` inside `handleAdd`, and `addItem(product, qty)`
was rejected.

**Reproduction.** Visit `/products/1` and add the handler that calls `addItem(product, quantity)`
after the render-time guard `if (status === 'error' || product === null) return ...`.
Run `npm run typecheck`.

**Tool used.** TypeScript compiler (`npm run typecheck`).

**Root cause.** The render body narrowed `product` to `Product`, but the narrowing was not
preserved inside the nested `handleAdd` function. The compiler must assume the closure can run
later, so it kept the `Product | null` type.

**Fix.** Capture a non-null `const currentProduct = product` after the guard and use it inside
the handler. The page was later split into a parent route component and a keyed
`ProductDetails` child, which also guarantees a fresh gallery, quantity and fetch state when
`:id` changes.

**What I learned.** Narrowing is flow-sensitive inside a function body, but closures need an
explicit non-null binding. A keyed child component is a cleaner way to reset page state when a
route parameter changes.

**Commit.** https://github.com/Omadzelevan/10x-last/commit/31276a9a3ccc6728fc3d3329affbbd7912263171

## Bug 4 — Synchronous `setState` inside the product effect

**Symptom.** Oxlint reported `react(set-state-in-effect)` for the invalid-product branch of the
product page effect. The branch called `setStatus('not-found')` synchronously during the effect,
causing an avoidable second render and making the effect do work that could be derived during
render.

**Reproduction.** `npm run lint` after the first product page implementation.

**Tool used.** Oxlint.

**Root cause.** The component used one effect both to validate the route parameter and to fetch.
Invalid ids were handled by writing state synchronously, and changing `:id` left the previous
product/quantity/gallery visible until the new response arrived.

**Fix.** `ProductPage` validates the id during render and returns `<NotFoundPage />` immediately
(no request). Valid ids render `<ProductDetails key={productId} … />`; the key remounts the
child, so state starts fresh and the effect only performs the async fetch. `setStatus('loading')`
was removed because the initial state is already `'loading'`.

**What I learned.** Effects should synchronize with external systems, not derive render state.
A keyed component is a simple, explainable reset mechanism for route parameters.

**Commit.** https://github.com/Omadzelevan/10x-last/commit/31276a9a3ccc6728fc3d3329affbbd7912263171

## Bug 5 — Network failure leaked the browser's "Failed to fetch" text

**Symptom.** With DummyJSON blocked (offline or a failed network), the catalog and product
pages showed the raw browser message `Failed to fetch` instead of the friendly
"Could not load products. Please try again." text.

**Reproduction.**

1. Open DevTools → Network and block `dummyjson.com` (or use Playwright `route.abort()`).
2. Open `/` and `/products/1`.
3. The error state rendered `Failed to fetch`.

**Tool used.** Headless Chromium with Playwright request interception.

**Root cause.** `fetch` rejects with a `TypeError` before an HTTP response exists. The page
catch blocks displayed `error.message`, which is the browser-specific text. The friendly message
was only used for non-`ok` HTTP responses.

**Fix.** Added a `getJson` helper in `src/api/products.api.ts` that catches fetch and JSON-parse
failures and throws `Could not load products. Please try again.`. `fetchProduct` applies the same
rule while still returning `null` for HTTP 404. The regression test now passes and no crash
occurs.

**What I learned.** Error handling must cover the rejection path, not only bad HTTP statuses.
A readable error message is a requirement, and the browser's message is not user-facing copy.

**Commit.** https://github.com/Omadzelevan/10x-last/commit/073530bc8dfa7c7b38470125c97a26abc49ea4de
