interface StockBadgeProps {
  stock: number
}

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return <span className="text-sm font-semibold text-red-700">Out of stock</span>
  }

  if (stock <= 5) {
    return (
      <span className="text-sm font-semibold text-orange-700">Only {stock} left!</span>
    )
  }

  return <span className="text-sm font-semibold text-green-700">In stock</span>
}
