import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')?.toLowerCase()?.trim() || ''

  const products = useMemo(() => {
    if (!q) return productsData
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    )
  }, [q])

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Products</h1>
        {q && (
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{q}&quot;
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-gray-500 py-12 text-center">No products found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}
