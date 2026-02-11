import { Link, useParams } from 'react-router-dom'
import productsData from '../data/products.json'
import ProductCard from '../components/ProductCard'
import { getHandToolsCategories, getHandToolsProductsByCategoryId } from '../lib/handTools'

export default function HandToolsCategoryPage() {
  const { subcategoryId } = useParams()
  const categories = getHandToolsCategories()
  const category = categories.find((c) => c.id === subcategoryId)

  if (!category) {
    return (
      <main className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gray-600 text-sm sm:text-base">This hand tools category could not be found.</p>
          <Link to="/hand-tools" className="mt-4 inline-flex text-primary hover:underline min-h-[44px] items-center text-sm sm:text-base">
            Back to hand tools
          </Link>
        </div>
      </main>
    )
  }

  const products = getHandToolsProductsByCategoryId(productsData, category.id)

  return (
    <main className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/hand-tools" className="hover:text-primary">
                Hand tools
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">{category.name}</li>
          </ol>
        </nav>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl">{category.description}</p>
          )}
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base">
            No products are mapped to this hand tools category yet.
          </p>
        ) : (
          <section aria-label={`${category.name} products`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

