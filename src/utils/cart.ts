import type { CartItem, CartState } from '../types/cart'
import { discountedPrice, round2 } from './format'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.productId === 'number' &&
    typeof item.title === 'string' &&
    typeof item.thumbnail === 'string' &&
    typeof item.price === 'number' &&
    typeof item.discountPercentage === 'number' &&
    typeof item.stock === 'number' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
}

export function isCartState(value: unknown): value is CartState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return Array.isArray(candidate.items) && candidate.items.every(isCartItem)
}

export interface CartTotals {
  subtotal: number
  total: number
  itemCount: number
}

export function calculateTotals(items: CartItem[]): CartTotals {
  let subtotal = 0
  let itemCount = 0

  for (const item of items) {
    subtotal += discountedPrice(item.price, item.discountPercentage) * item.quantity
    itemCount += item.quantity
  }

  const total = round2(subtotal)

  return { subtotal: total, total, itemCount }
}
