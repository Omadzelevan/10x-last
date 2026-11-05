import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, CartState } from '../types/cart'
import type { Product } from '../types/product'
import { calculateTotals, isCartState } from '../utils/cart'
import { CartContext } from './cartContext'

const CART_STORAGE_KEY = 'shop_cart'

function loadCart(): CartState {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)

    if (stored === null) {
      return { items: [] }
    }

    const parsed: unknown = JSON.parse(stored)

    return isCartState(parsed) ? parsed : { items: [] }
  } catch {
    return { items: [] }
  }
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.min(Math.max(Math.trunc(quantity), 1), stock)
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Storage can be unavailable (private mode or quota); the cart still works in memory.
    }
  }, [cart])

  function addItem(product: Product, quantity: number): void {
    setCart((current) => {
      const existing = current.items.find((item) => item.productId === product.id)
      const maxQuantity = Math.max(product.stock, 0)

      if (maxQuantity === 0) {
        return current
      }

      if (existing) {
        const updated: CartItem = {
          ...existing,
          quantity: clampQuantity(existing.quantity + quantity, maxQuantity),
        }

        return {
          items: current.items.map((item) =>
            item.productId === product.id ? updated : item,
          ),
        }
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: clampQuantity(quantity, maxQuantity),
      }

      return { items: [...current.items, newItem] }
    })
  }

  function setQuantity(productId: number, quantity: number): void {
    setCart((current) => ({
      items: current.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: clampQuantity(quantity, item.stock) }
          : item,
      ),
    }))
  }

  function removeItem(productId: number): void {
    setCart((current) => ({
      items: current.items.filter((item) => item.productId !== productId),
    }))
  }

  function clearCart(): void {
    setCart({ items: [] })
  }

  const totals = calculateTotals(cart.items)

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
