import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel'
import BrandStrip from '../components/BrandStrip'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import siteData from '../data/site.json'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'

const stats = [
  { value: '20+', label: 'Brands' },
  { value: '30+', label: 'Categories' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '20+', label: 'Years in Market' },
]

export default function HomePage() {
  const featured = productsData.filter((p) => p.featured)
  const newProducts = productsData.filter((p) => p.new)
  const topSellers = productsData.filter((p) => p.featured).slice(0, 6)
  const automotiveProducts = productsData.filter((p) => p.categoryId === 'automotive-tools')
  const highlightProduct = productsData.find((p) => p.slug === 'ratchet-handle-72t') || productsData[0]
  const similarProducts = productsData.filter((p) => p.categoryId === highlightProduct?.categoryId && p.id !== highlightProduct?.id).slice(0, 3)

  return (
    <>
      <HeroCarousel />
      <BrandStrip />

      {/* Product Categories */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="categories-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Product Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categoriesData.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-gray-50" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="text-sm font-semibold text-primary">New</span>
            <span className="text-sm font-semibold text-gray-500">FEATURED</span>
            <span className="text-sm font-semibold text-gray-500">TOP SELLERS</span>
          </div>
          <h2 id="featured-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {featured.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-white" aria-label="Company stats">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold">{value}</div>
                <div className="text-white/90 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Must-have / Automotive */}
      <section className="py-12 md:py-16 bg-white" aria-labelledby="musthave-heading">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="musthave-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Must-have Products
          </h2>
          <p className="text-gray-600 mb-8">Everything you need in one place</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {categoriesData.slice(0, 5).map((cat) => (
              <Link key={cat.id} to={`/products/category/${cat.slug}`} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                {cat.name}
              </Link>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automotive Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {(automotiveProducts.length ? automotiveProducts : productsData.slice(0, 3)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Engineered for real work + Similar */}
      <section className="py-12 md:py-16 bg-gray-50" aria-labelledby="engineered-heading">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="engineered-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Engineered for Real Work
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="aspect-square max-w-md bg-gray-200 rounded-xl overflow-hidden">
              {highlightProduct?.image ? (
                <img src={highlightProduct.image} alt={highlightProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400">{highlightProduct?.name?.charAt(0)}</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{highlightProduct?.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{highlightProduct?.categoryName} · {highlightProduct?.brand}</p>
              <p className="mt-4 text-gray-600">{highlightProduct?.description}</p>
              <Link to={`/products/${highlightProduct?.slug}`} className="inline-flex mt-4 text-primary font-medium hover:underline">
                Read more
              </Link>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {similarProducts.length ? similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            )) : productsData.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
