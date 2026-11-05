import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products.api'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { PageContainer } from '../components/ui/PageContainer'
import { Spinner } from '../components/ui/Spinner'
import { ProductGrid } from '../components/product/ProductGrid'
import { useCart } from '../context/useCart'
import type { Product } from '../types/product'

type CatalogStatus = 'loading' | 'success' | 'error'

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<CatalogStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [notice, setNotice] = useState('')
  const { items, addItem } = useCart()

  useEffect(() => {
    let cancelled = false

    fetchProducts()
      .then((data) => {
        if (cancelled) {
          return
        }

        setProducts(data.products)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Could not load products.',
        )
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleAdd(product: Product): void {
    const currentQuantity =
      items.find((item) => item.productId === product.id)?.quantity ?? 0

    if (currentQuantity >= product.stock) {
      setNotice(`Only ${product.stock} in stock`)
      return
    }

    addItem(product, 1)
    setNotice('Added to cart ✓')
  }

  return (
    <PageContainer>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catalog</h1>
        {status === 'success' ? (
          <p className="text-sm text-slate-600">{products.length} products</p>
        ) : null}
      </div>

      {notice ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-6">
        {status === 'loading' ? <Spinner /> : null}

        {status === 'error' ? <ErrorMessage message={errorMessage} /> : null}

        {status === 'success' && products.length === 0 ? (
          <EmptyState title="No products found." />
        ) : null}

        {status === 'success' && products.length > 0 ? (
          <ProductGrid products={products} onAdd={handleAdd} />
        ) : null}
      </div>
    </PageContainer>
  )
}
