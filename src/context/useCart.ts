import { useContext } from 'react'
import { CartContext } from './cartContext'
import type { CartContextValue } from './cartContext'

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error('useCart must be used inside a CartProvider')
  }

  return context
}
