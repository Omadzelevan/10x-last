import type { ReactNode } from 'react'
import { formatPrice } from '../../utils/format'

interface CartSummaryProps {
  subtotal: number
  total: number
  children: ReactNode
}

export function CartSummary({ subtotal, total, children }: CartSummaryProps) {
  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-medium text-slate-900">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <dt className="text-base font-semibold text-slate-900">Total</dt>
          <dd className="text-base font-bold text-slate-900">{formatPrice(total)}</dd>
        </div>
      </dl>
      <div className="mt-5">{children}</div>
    </aside>
  )
}
