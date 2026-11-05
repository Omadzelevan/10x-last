import { Link } from 'react-router-dom'
import type { CartItem } from '../../types/cart'
import { discountedPrice, formatPrice } from '../../utils/format'
import { Button } from '../ui/Button'

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const unitPrice = discountedPrice(item.price, item.discountPercentage)
  const lineTotal = unitPrice * item.quantity

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
      <img
        src={item.thumbnail}
        alt={item.title}
        width={96}
        height={96}
        loading="lazy"
        className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-contain p-2"
      />

      <div className="min-w-0 flex-1">
        <Link
          to={`/products/${item.productId}`}
          className="font-semibold text-slate-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-slate-600">
          {formatPrice(unitPrice)} each · {item.stock} in stock
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-lg border border-slate-300 bg-white">
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.title}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-l-lg text-lg font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.title}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-r-lg text-lg font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={item.quantity >= item.stock}
            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          >
            +
          </button>
        </div>

        <p className="min-w-24 text-right font-semibold text-slate-900">
          {formatPrice(lineTotal)}
        </p>

        <Button variant="ghost" onClick={() => onRemove(item.productId)}>
          Remove
        </Button>
      </div>
    </li>
  )
}
