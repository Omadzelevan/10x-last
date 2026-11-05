import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { Button } from '../ui/Button'
import { PriceBlock } from './PriceBlock'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="flex flex-1 flex-col rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          loading="lazy"
          className="h-48 w-full bg-slate-100 object-contain p-4"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
            {product.title}
          </h2>
          <p className="text-sm capitalize text-slate-600">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ''}
          </p>
          <p className="text-sm font-medium text-slate-700">★ {product.rating.toFixed(1)}</p>
          <div className="mt-auto flex flex-col gap-2">
            <PriceBlock
              price={product.price}
              discountPercentage={product.discountPercentage}
            />
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={outOfStock}
          onClick={() => onAdd(product)}
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>
    </article>
  )
}
