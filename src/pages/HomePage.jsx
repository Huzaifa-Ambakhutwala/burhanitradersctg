import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel'
import BrandStrip from '../components/BrandStrip'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { categoryPublicPath } from '../lib/catalogPaths'

const stats = [
  { value: '20+', label: 'Brands' },
  { value: '—', label: 'Categories' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '20+', label: 'Years in Market' },
]

export default function HomePage() {
  const { products } = useProducts()
  const { categories } = useCategories()

  const newArrivals = products.filter((p) => p.new).slice(0, 8)
  const featured = products.filter((p) => p.featured).slice(0, 10)
  const topSellers = products.filter((p) => p.topSeller).slice(0, 10)

  const highlightProduct =
    products.find((p) => p.featured) || products.find((p) => p.topSeller) || products[0]
  const similarProducts = highlightProduct
    ? products.filter((p) => p.categoryId === highlightProduct.categoryId && p.id !== highlightProduct.id).slice(0, 3)
    : []

  const highlightImage = highlightProduct?.primaryImageUrl || highlightProduct?.image

  const statsDisplay = stats.map((s) =>
    s.label === 'Categories' ? { ...s, value: categories.length ? String(categories.length) : '—' } : s
  )

  return (
    <>
      <HeroCarousel />
      <BrandStrip />

      <section className="py-8 sm:py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="categories-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Product Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-600 text-sm">Categories will appear here once they are added in the admin portal.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={{
                    ...cat,
                    productCount: products.filter((p) => p.categoryId === cat.id).length,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="new-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6 sm:mb-8">
              <h2 id="new-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                New arrivals
              </h2>
              <span className="text-sm font-semibold text-primary">NEW</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-sm font-semibold text-primary">FEATURED</span>
            </div>
            <h2 id="featured-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Featured products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {topSellers.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="topsellers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-sm font-semibold text-gray-700">TOP SELLERS</span>
            </div>
            <h2 id="topsellers-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Top sellers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {topSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 sm:py-12 bg-primary text-white" aria-label="Company stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {statsDisplay.map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</div>
                <div className="text-white/90 mt-1 text-sm sm:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-white" aria-labelledby="musthave-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="musthave-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Shop by category
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Browse products grouped the same way as in your catalog</p>
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length
              if (count === 0) return null
              return (
                <Link
                  key={cat.id}
                  to={categoryPublicPath(cat.slug)}
                  className="px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white active:bg-primary-dark transition-colors text-sm font-medium min-h-[44px] inline-flex items-center gap-1"
                >
                  {cat.name}
                  <span className="text-xs opacity-80">({count})</span>
                </Link>
              )
            })}
          </div>
          <div className="space-y-10 sm:space-y-12">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.categoryId === cat.id)
              if (catProducts.length === 0) return null
              const preview = catProducts.slice(0, 4)
              return (
                <div key={cat.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{cat.name}</h3>
                    <Link to={categoryPublicPath(cat.slug)} className="text-sm font-medium text-primary hover:underline">
                      View all {catProducts.length} products →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {preview.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {highlightProduct && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="engineered-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 id="engineered-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Engineered for Real Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mb-8 sm:mb-12">
              <div className="aspect-square max-w-md w-full mx-auto bg-gray-200 rounded-xl overflow-hidden">
                {highlightImage ? (
                  <img src={highlightImage} alt={highlightProduct?.name || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400">
                    {highlightProduct?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{highlightProduct?.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">
                  {highlightProduct?.categoryName} · {highlightProduct?.brand}
                </p>
                <p className="mt-4 text-gray-600 text-sm sm:text-base">{highlightProduct?.description}</p>
                <Link
                  to={`/products/${highlightProduct?.slug}`}
                  className="inline-flex mt-4 py-2 text-primary font-medium hover:underline min-h-[44px] items-center"
                >
                  Read more
                </Link>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.length ? (
                similarProducts.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
