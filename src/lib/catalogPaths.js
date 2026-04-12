/** Public storefront path for a category by slug */
export function categoryPublicPath(slug) {
  if (!slug) return '/products'
  return `/products/category/${encodeURIComponent(slug)}`
}
