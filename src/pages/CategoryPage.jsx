import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = useMemo(() => categoriesData.find((c) => c.slug === slug), [slug])
  const products = useMemo(
    () => (category ? productsData.filter((p) => p.categoryId === category.id) : []),
    [category]
  )

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600">Category not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary font-medium hover:underline">View all products</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 break-words" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-600 mb-6 sm:mb-8">{products.length} products</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
