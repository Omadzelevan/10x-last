import type { Product, ProductsResponse } from '../types/product'

const API_URL = 'https://dummyjson.com'
const PRODUCTS_ERROR = 'Could not load products. Please try again.'
const PRODUCT_ERROR = 'Could not load this product. Please try again.'

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
    (product.brand === undefined || typeof product.brand === 'string') &&
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

  return (
    Array.isArray(response.products) &&
    response.products.every(isProduct) &&
    typeof response.total === 'number' &&
    typeof response.skip === 'number' &&
    typeof response.limit === 'number'
  )
}

async function getJson(url: string, message: string): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(url)
  } catch {
    // fetch rejects on network failures; hide the browser-specific "Failed to fetch" text.
    throw new Error(message)
  }

  if (!response.ok) {
    throw new Error(message)
  }

  try {
    return await response.json()
  } catch {
    throw new Error(message)
  }
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const data = await getJson(`${API_URL}/products?limit=12&skip=0`, PRODUCTS_ERROR)

  if (!isProductsResponse(data)) {
    throw new Error(PRODUCTS_ERROR)
  }

  return data
}

export async function fetchProduct(id: number): Promise<Product | null> {
  let response: Response

  try {
    response = await fetch(`${API_URL}/products/${id}`)
  } catch {
    throw new Error(PRODUCT_ERROR)
  }

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(PRODUCT_ERROR)
  }

  let data: unknown

  try {
    data = await response.json()
  } catch {
    throw new Error(PRODUCT_ERROR)
  }

  if (!isProduct(data)) {
    throw new Error(PRODUCT_ERROR)
  }

  return data
}
