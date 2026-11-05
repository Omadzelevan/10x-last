# DEFENSE — 20 კითხვა და მოკლე პასუხი

თითო პასუხი მიუთითებს რეალურ ფაილს, რომელიც დაცვაზე უნდა გახსნა. პასუხები მოკლეა —
დეტალები კოდშია.

## 1. props და state — რა განსხვავებაა თქვენს კოდში?
`ProductCard` მონაცემებს იღებს **props**-ით (`product`, `onAdd`) და არ ცვლის მათ.
`CatalogPage`-ში პროდუქტების სია **state**-ია (`useState<Product[]>`), რადგან ის იცვლება
fetch-ის შემდეგ. იხ. `src/components/product/ProductCard.tsx`, `src/pages/CatalogPage.tsx`.

## 2. რატომ სჭირდება `map()`-ს `key`?
`key={product.id}` React-ს ეხმარება ელემენტების იდენტიფიცირებაში განახლებისას. ინდექსის key
სიის ცვლილებაზე არასწორად დაამთხვევს state-ს. იხ. `ProductGrid.tsx`.

## 3. `useEffect`-ის dependencies და cleanup
`CatalogPage`-ში effect-ს აქვს `[]` — მხოლოდ mount-ზე ერთხელ. cleanup აყენებს
`cancelled = true`-ს, რომ unmount-ის შემდეგ state არ შეიცვალოს. `ProductPage`-ში dependency
`productId`-ია, ამიტომ id-ის ცვლილებაზე ახალი request მიდის. `ScrollToTop`-ში — `pathname`.
იხ. `CatalogPage.tsx`, `ProductPage.tsx`, `ScrollToTop.tsx`.

## 4. რატომ არის საჭირო immutable update?
React state-ის ცვლილებას reference-ით ამოიცნობს. `items.map(...)`, `items.filter(...)` და
spread ახალ მასივებს/ობიექტებს ქმნის, ამიტომ re-render ხდება. mutation-ს React ვერ დაინახავს.
იხ. `src/context/CartContext.tsx`.

## 5. Context vs props drilling
კალათა და login საჭიროა Header-ში, Cart-ში, Checkout-ში და Product-ზე. props-ით გადაცემა
ყველა შუალედურ კომპონენტს გაატარებდა. ამიტომ `AuthProvider` და `CartProvider` გლობალურ
state-ს იძლევიან `useAuth()` / `useCart()`-ით. იხ. `src/context/`, `src/main.tsx`.

## 6. Controlled inputs და `preventDefault()`
Login/Checkout ველებს აქვთ `value` state-იდან და `onChange` ცვლის state-ს. submit handler
იძახებს `event.preventDefault()`-ს, რომ გვერდი არ გადაიტვირთოს, შემდეგ ამოწმებს ველებს.
იხ. `LoginPage.tsx`, `CheckoutPage.tsx`.

## 7. "Lifting state up" სად იყენებთ?
`CatalogPage` ფლობს პროდუქტებს და `ProductCard`-ს გადასცემს `onAdd` callback-ს. ღილაკზე
დაჭერისას ბავშვი იძახებს მშობლის handler-ს, რომელიც CartContext-ს ანახლებს.
იხ. `CatalogPage.tsx` → `ProductGrid.tsx` → `ProductCard.tsx`.

## 8. რას აკეთებს `strict` და `noImplicitAny`?
`strict: true` რთავს მკაცრ შემოწმებებს, მათ შორის `noImplicitAny`-ს: პარამეტრს ტიპი
აუცილებლად სჭირდება. `npm run typecheck` მიუთითებს `tsconfig.app.json`-ს და რეალურად
ამოწმებს `src/`-ს — დადასტურებულია განზრახ შეცდომით (`DEBUG-LOG.md`, Bug 1).

## 9. `interface` თუ `type` — რატომ ეს არჩევანი?
მონაცემთა ფორმებისთვის (Product, CartItem, Props) გამოვიყენე `interface` — გაფართოებადია და
კარგად იკითხება. Union-ებისთვის (`CatalogStatus`, `ProductStatus`) — `type`.
იხ. `src/types/*.ts`, `CatalogPage.tsx`.

## 10. რატომ სჭირდება `localStorage`-ს type guard?
`JSON.parse` აბრუნებს `unknown`-ს და შეიძლება ძველი/დაზიანებული მონაცემი იყოს.
`isCartState` ამოწმებს სტრუქტურას; თუ არ ემთხვევა — ცარიელი კალათა. try/catch ფარავს
დაზიანებულ JSON-ს. იხ. `src/utils/cart.ts`, `CartContext.tsx`.

## 11. როგორ მუშაობს guest → login → checkout redirect?
`ProtectedRoute` ამოწმებს `user`-ს. თუ არ არის — `Navigate to="/login"` და state-ში აწვდის
`from`-ს. Login-ის წარმატების შემდეგ `navigate(from ?? "/", { replace: true })`.
იხ. `src/routes/ProtectedRoute.tsx`, `LoginPage.tsx`.

## 12. რა მოხდება `useEffect` cleanup-ის გარეშე?
ნელი request-ის პასუხი შეიძლება მოვიდეს კომპონენტის unmount-ის ან id-ის შეცვლის შემდეგ და
ძველი პროდუქტი "გადაფაროს" ახალს. `cancelled` flag ამას ბლოკავს. იხ. `ProductPage.tsx`.

## 13. როგორ არის Tailwind v4 ჩართული Vite-ში?
`vite.config.ts`-ში `@tailwindcss/vite` plugin-ია, `src/index.css`-ში —
`@import "tailwindcss";`. არ არის `tailwind.config.js`, PostCSS config ან `@tailwind`
directive. იხ. `vite.config.ts`, `src/index.css`.

## 14. რატომ იცვლება grid breakpoint-ებზე?
`grid-cols-1 min-[481px]:grid-cols-2 min-[1025px]:grid-cols-4` — mobile-first. 375px-ზე
1 სვეტი, 481–1024-ზე 2, 1025+-ზე 4. იხ. `ProductGrid.tsx`.

## 15. რას იჭერს Error Boundary და რას — არა?
იჭერს render-ის, lifecycle-ის და child კომპონენტების შეცდომებს (`getDerivedStateFromError` +
`componentDidCatch`). **არ** იჭერს event handler-ების, async კოდის, setTimeout-ის ან server-side
შეცდომებს. fallback: "Something went wrong." + Reload. იხ. `ErrorBoundary.tsx`.

## 16. რატომ `useState` და არა `useReducer` კალათისთვის?
CORE-ში მოქმედებები მარტივია (add/update/remove/clear), ამიტომ `useState` საკმარისია და
უფრო მარტივად აიხსნება. reducer FULL-ის ნაწილია და არ დამიმატებია.

## 17. როგორ არის დაცული stock წესი?
`clampQuantity` ინახავს `1 ≤ qty ≤ stock`-ს; UI-ზე stepper-ის ღილაკები disabled-ია კიდეებზე;
დამატებისას ამოწმებს `currentQuantity + quantity > stock` და აჩვენებს "Only N in stock".
იხ. `CartContext.tsx`, `ProductPage.tsx`, `CartItemRow.tsx`.

## 18. საიდან მოდის Subtotal/Total?
ცალკე state არ არის — `calculateTotals(items)` derived მნიშვნელობაა
`discountedPrice × quantity`-იდან, `round2`-ით. იხ. `src/utils/cart.ts`, `format.ts`.

## 19. როგორ არის მოწყობილი routes და Layout?
ერთი `Layout` route (Header + `<Outlet />` + Footer); შიგნით — `/`, `/login`,
`/products/:id`, `/cart`, `/checkout` (ProtectedRoute) და `*` NotFound.
იხ. `src/routes/AppRoutes.tsx`, `Layout.tsx`.

## 20. რატომ არ "იტაცებს" empty-cart redirect შეკვეთის დადასტურებას?
`CheckoutPage`-ში ჯერ `if (order) return <confirmation />` შემოწმდება, მერე
`if (items.length === 0) return <Navigate to="/cart" />`. `setOrder` და `clearCart` ერთად
სრულდება, ამიტომ confirmation რჩება. იხ. `CheckoutPage.tsx` (D9).

## Error Boundary-ის დემო დაცვაზე

`CatalogPage`-ის დასაწყისში დროებით ჩასვი `throw new Error('demo')`, გაუშვი `npm run dev` —
გამოჩნდება "Something went wrong." და Reload. შემდეგ წაშალე ხაზი. (ეს ტესტი რეალურად
შესრულებულია და აღწერილია `REPORT.md`-ში.)

## სწრაფი ბრძანებები

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```
