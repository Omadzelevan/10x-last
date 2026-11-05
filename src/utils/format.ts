const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function discountedPrice(price: number, discountPercentage: number): number {
  return round2(price * (1 - discountPercentage / 100))
}

export function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
