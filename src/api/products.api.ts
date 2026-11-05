import type { Product, ProductsResponse } from '../types/product'

const API_URL = 'https://dummyjson.com'

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const product = value as Record<string, unknown>

  return (
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    typeof product.discountPercentage === 'number' &&
    typeof product.rating === 'number' &&
    typeof product.stock === 'number' &&
    typeof product.thumbnail === 'string' &&
    Array.isArray(product.images) &&
    product.images.every((image) => typeof image === 'string')
  )
}

function isProductsResponse(value: unknown): value is ProductsResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const response = value as Record<string, unknown>

  return Array.isArray(response.products) && response.products.every(isProduct)
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_URL}/products?limit=12&skip=0`)

  if (!response.ok) {
    throw new Error('Could not load products. Please try again.')
  }

  const data: unknown = await response.json()

  if (!isProductsResponse(data)) {
    throw new Error('The product data has an unexpected shape.')
  }

  return data
}

export async function fetchProduct(id: number): Promise<Product | null> {
  const response = await fetch(`${API_URL}/products/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Could not load this product. Please try again.')
  }

  const data: unknown = await response.json()

  if (!isProduct(data)) {
    throw new Error('The product data has an unexpected shape.')
  }

  return data
}
