import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'
import type { ShippingInfo } from '../types/checkout'
import { discountedPrice, formatPrice, round2 } from '../utils/format'
import { validateCheckout } from '../utils/validation'
import type { CheckoutErrors } from '../utils/validation'

interface PlacedOrder {
  total: number
  itemCount: number
  fullName: string
}

export function CheckoutPage() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const [values, setValues] = useState<ShippingInfo>({
    fullName: user?.username ?? '',
    email: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (order) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-xl rounded-xl border border-green-200 bg-white px-6 py-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Thank you! Your order has been placed.
          </h1>
          <p className="mt-3 text-slate-700">
            {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} ·{' '}
            <span className="font-semibold">{formatPrice(order.total)}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">Shipping to {order.fullName}</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (items.length === 0) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{ message: 'Your cart is empty. Add products before checking out.' }}
      />
    )
  }

  function updateField(field: keyof ShippingInfo, value: string): void {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (placing) {
      return
    }

    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const orderSnapshot: PlacedOrder = {
      total: subtotal,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      fullName: values.fullName.trim(),
    }

    setPlacing(true)

    timeoutRef.current = window.setTimeout(() => {
      setOrder(orderSnapshot)
      clearCart()
      setPlacing(false)
    }, 700)
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">
        This is a local demo checkout; no payment is processed.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-800">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={values.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              />
              {errors.fullName ? (
                <p id="fullName-error" className="mt-1 text-sm text-red-700">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-sm text-red-700">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-800">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={values.address}
                onChange={(event) => updateField('address', event.target.value)}
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={errors.address ? 'address-error' : undefined}
                className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              />
              {errors.address ? (
                <p id="address-error" className="mt-1 text-sm text-red-700">
                  {errors.address}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-800">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={values.city}
                onChange={(event) => updateField('city', event.target.value)}
                aria-invalid={errors.city ? true : undefined}
                aria-describedby={errors.city ? 'city-error' : undefined}
                className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              />
              {errors.city ? (
                <p id="city-error" className="mt-1 text-sm text-red-700">
                  {errors.city}
                </p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={placing}>
            {placing ? 'Placing order…' : 'Place order'}
          </Button>
        </form>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-4 flex list-none flex-col gap-3">
            {items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-slate-700">
                  {item.title} × {item.quantity}
                </span>
                <span className="whitespace-nowrap font-medium text-slate-900">
                  {formatPrice(
                    round2(
                      discountedPrice(item.price, item.discountPercentage) * item.quantity,
                    ),
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-base font-semibold text-slate-900">Total</span>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(subtotal)}
            </span>
          </div>
        </aside>
      </div>
    </PageContainer>
  )
}
