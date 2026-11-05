import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products.api'
import { PriceBlock } from '../components/product/PriceBlock'
import { StockBadge } from '../components/product/StockBadge'
import { Button } from '../components/ui/Button'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { PageContainer } from '../components/ui/PageContainer'
import { Spinner } from '../components/ui/Spinner'
import { useCart } from '../context/useCart'
import type { Product } from '../types/product'
import { NotFoundPage } from './NotFoundPage'

type ProductStatus = 'loading' | 'success' | 'error' | 'not-found'

interface ProductDetailsProps {
  productId: number
}

export function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const isValidId = Number.isInteger(productId) && productId > 0

  if (!isValidId) {
    return <NotFoundPage />
  }

  return <ProductDetails key={productId} productId={productId} />
}

function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<ProductStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState('')
  const { items, addItem } = useCart()

  useEffect(() => {
    let cancelled = false

    fetchProduct(productId)
      .then((data) => {
        if (cancelled) {
          return
        }

        if (data === null) {
          setStatus('not-found')
          return
        }

        setProduct(data)
        setSelectedImage(data.thumbnail)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Could not load this product.',
        )
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [productId])

  if (status === 'not-found') {
    return <NotFoundPage />
  }

  if (status === 'loading') {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    )
  }

  if (status === 'error' || product === null) {
    return (
      <PageContainer>
        <ErrorMessage message={errorMessage} />
        <Link
          to="/"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-slate-900 underline underline-offset-2"
        >
          ← Back to catalog
        </Link>
      </PageContainer>
    )
  }

  const currentProduct = product
  const currentQuantity =
    items.find((item) => item.productId === currentProduct.id)?.quantity ?? 0
  const outOfStock = currentProduct.stock === 0
  const images =
    currentProduct.images.length > 0 ? currentProduct.images : [currentProduct.thumbnail]

  function handleAdd(): void {
    if (currentQuantity + quantity > currentProduct.stock) {
      setFeedback(`Only ${currentProduct.stock} in stock`)
      return
    }

    addItem(currentProduct, quantity)
    setFeedback('Added to cart ✓')
  }

  return (
    <PageContainer>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
      >
        ← Back to catalog
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <img
            src={selectedImage}
            alt={currentProduct.title}
            width={600}
            height={600}
            className="aspect-square w-full rounded-xl border border-slate-200 bg-white object-contain p-6"
          />
          {images.length > 1 ? (
            <ul className="mt-4 flex list-none flex-wrap gap-3">
              {images.map((image) => (
                <li key={image}>
                  <button
                    type="button"
                    aria-label={`Show image of ${currentProduct.title}`}
                    aria-pressed={selectedImage === image}
                    onClick={() => setSelectedImage(image)}
                    className={`rounded-lg border bg-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                      selectedImage === image
                        ? 'border-slate-900'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      width={72}
                      height={72}
                      loading="lazy"
                      className="h-16 w-16 object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {currentProduct.title}
          </h1>
          <p className="text-sm capitalize text-slate-600">
            {currentProduct.category}
            {currentProduct.brand ? ` · ${currentProduct.brand}` : ''}
          </p>
          <p className="text-base font-medium text-slate-700">
            ★ {currentProduct.rating.toFixed(1)}
          </p>
          <PriceBlock
            price={currentProduct.price}
            discountPercentage={currentProduct.discountPercentage}
            size="lg"
          />
          <StockBadge stock={currentProduct.stock} />

          <p className="text-slate-700">{currentProduct.description}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-300 bg-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-l-lg text-lg font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={outOfStock || quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-r-lg text-lg font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={outOfStock || quantity >= currentProduct.stock}
                onClick={() =>
                  setQuantity((current) => Math.min(currentProduct.stock, current + 1))
                }
              >
                +
              </button>
            </div>

            <Button disabled={outOfStock} onClick={handleAdd}>
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>

          {feedback ? (
            <p
              role="status"
              aria-live="polite"
              className="text-sm font-semibold text-slate-800"
            >
              {feedback}
            </p>
          ) : null}
        </div>
      </div>
    </PageContainer>
  )
}
