import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'

export default function CategoryPage() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const { getCategoryBySlug, loading: catLoading } = useCategories()

  const category = useMemo(() => getCategoryBySlug(slug), [slug, getCategoryBySlug])
  const list = useMemo(
    () => (category ? products.filter((p) => p.categoryId === category.id) : []),
    [category, products]
  )

  if (catLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center text-gray-600 text-sm">Loading…</div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600">Category not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary font-medium hover:underline">
          View all products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 break-words" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category?.name || '…'}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{category?.name}</h1>
        <p className="text-gray-600 mb-6 sm:mb-8">{loading ? '…' : `${list.length} products`}</p>
        {loading && <p className="text-gray-600 text-sm">Loading…</p>}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
