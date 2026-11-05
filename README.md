# 10X Shop

10X Shop is a demo e-commerce single-page application built as an individual graduation project. It shows a product catalog loaded from DummyJSON, product details, a persistent shopping cart, a simulated login and a local checkout flow. Everything runs in the browser: there is no real authentication, payment or write request to a server.

## Live demo

TODO(student): add the deployed URL (Vercel).

## Features (CORE)

- Catalog of 12 products with loading, error and empty states.
- Product details with an image gallery, discounted price, stock status and quantity stepper.
- Cart with quantity changes, item removal, totals and `localStorage` persistence.
- Simulated login with controlled inputs and field-level validation.
- Protected checkout with four validated fields and a local order confirmation.
- Stock rules enforced everywhere (`1 ≤ quantity ≤ stock`).
- Responsive layout (375px, tablet, desktop) with a mobile burger menu.
- Header cart badge and active navigation state.
- 404 page for unknown routes and unknown product ids.
- Error Boundary with a reload fallback.

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite |
| UI | React 19, TypeScript (strict), React Router |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Data | [DummyJSON](https://dummyjson.com) `GET /products` and `GET /products/:id` |
| Lint | Oxlint |
| Deploy | Vercel (`vercel.json` SPA rewrites) |

## Architecture

```text
src/
  api/         products.api.ts          # fetchProducts(), fetchProduct(id)
  types/       product.ts user.ts cart.ts checkout.ts
  context/     AuthContext.tsx CartContext.tsx useAuth.ts useCart.ts
  components/
    ui/        Button, Spinner, ErrorMessage, EmptyState, PageContainer
    layout/    Layout, Header, Footer, ScrollToTop
    product/   ProductCard, ProductGrid, StockBadge, PriceBlock
    cart/      CartItemRow, CartSummary
    ErrorBoundary.tsx
  pages/       CatalogPage, ProductPage, CartPage, CheckoutPage, LoginPage, NotFoundPage
  routes/      AppRoutes.tsx ProtectedRoute.tsx
  utils/       format.ts validation.ts cart.ts navigation.ts
```

Data flow: a user event calls an event handler, the handler updates local state or a Context
function, and the update is written immutably (for example `items.map(...)` or
`items.filter(...)`). React then re-renders only the components that read the changed state,
so the header badge, cart page and checkout summary stay in sync. Product data is fetched in
`useEffect`; loading, error and empty states are rendered conditionally. The cart is read once
from `localStorage` on initialization and written back in a `useEffect`, and every read is
checked by the `isCartState` type guard.

## How to run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Type-check `src/` with `tsconfig.app.json` |
| `npm run lint` | Run Oxlint |
| `npm run build` | Type-check project references and create a production build |
| `npm run preview` | Preview the production build locally |

## Test account

Login is a local simulation; any non-empty username and a password of at least 6 characters is
accepted. The documented demo account is:

- Username: `emilys`
- Password: `emilyspass`

The login state is intentionally **not** persisted: refreshing the page returns you to guest
mode. The cart **is** persisted and survives refresh and logout.

## Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. `vercel.json` rewrites all routes to `index.html`, so opening or refreshing
   `/products/5` directly works.
5. Put the live URL in this README.

## Project documents

- [PLAN.md](PLAN.md) — scope, phases, WBS, risks, definition of done
- [REPORT.md](REPORT.md) — planned vs delivered, metrics, problems, AI usage
- [DEBUG-LOG.md](DEBUG-LOG.md) — real bugs found while building
- [COMPATIBILITY.md](COMPATIBILITY.md) — browser compatibility matrix
- [DEFENSE.md](DEFENSE.md) — 20 likely defense questions with code references (Georgian)
- [ai-log.md](ai-log.md) — short honest AI usage log

## Credits

Product data is provided by [DummyJSON](https://dummyjson.com). Built with React, TypeScript
and Tailwind CSS. AI assistance (OpenCode with a coding agent) was used to scaffold, review and
test the implementation; the student is responsible for understanding and defending the code.
