import { discountedPrice, formatPrice } from '../../utils/format'

interface PriceBlockProps {
  price: number
  discountPercentage: number
  size?: 'md' | 'lg'
}

export function PriceBlock({ price, discountPercentage, size = 'md' }: PriceBlockProps) {
  const currentPrice = discountedPrice(price, discountPercentage)
  const hasDiscount = discountPercentage >= 1
  const currentSize = size === 'lg' ? 'text-3xl' : 'text-xl'
  const originalSize = size === 'lg' ? 'text-lg' : 'text-sm'

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`${currentSize} font-bold text-slate-900`}>
        {formatPrice(currentPrice)}
      </span>
      {hasDiscount ? (
        <>
          <span className={`${originalSize} text-slate-500 line-through`}>
            {formatPrice(price)}
          </span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
            −{Math.round(discountPercentage)}%
          </span>
        </>
      ) : null}
    </div>
  )
}
