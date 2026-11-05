import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CartItemRow } from '../components/cart/CartItemRow'
import { CartSummary } from '../components/cart/CartSummary'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { PageContainer } from '../components/ui/PageContainer'
import { useCart } from '../context/useCart'
import { getStateMessage } from '../utils/navigation'

export function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clearCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const message = getStateMessage(location.state)

  function handleClearCart(): void {
    const confirmed = window.confirm('Clear the cart? This cannot be undone.')

    if (confirmed) {
      clearCart()
    }
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cart</h1>

      {message ? (
        <p
          role="status"
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {message}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Your cart is empty.">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Browse products
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <ul className="flex list-none flex-col gap-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>
            <div className="mt-4">
              <Button variant="danger" onClick={handleClearCart}>
                Clear cart
              </Button>
            </div>
          </div>

          <CartSummary subtotal={subtotal} total={subtotal}>
            <Button className="w-full" onClick={() => navigate('/checkout')}>
              Proceed to checkout
            </Button>
          </CartSummary>
        </div>
      )}
    </PageContainer>
  )
}
