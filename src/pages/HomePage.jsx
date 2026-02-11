import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel'
import BrandStrip from '../components/BrandStrip'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import siteData from '../data/site.json'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { getBackendFileUrl } from '../lib/adminApi'

const stats = [
  { value: '20+', label: 'Brands' },
  { value: '30+', label: 'Categories' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '20+', label: 'Years in Market' },
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function HomePage() {
  const featured = productsData.filter((p) => p.featured)
  const newProducts = productsData.filter((p) => p.new)
  const topSellers = productsData.filter((p) => p.featured).slice(0, 6)
  const highlightProduct = productsData.find((p) => p.slug === 'ratchet-handle-72t') || productsData[0]
  const similarProducts = productsData.filter((p) => p.categoryId === highlightProduct?.categoryId && p.id !== highlightProduct?.id).slice(0, 3)

  const [highlightPhotoUrl, setHighlightPhotoUrl] = useState(null)
  const [highlightPhotoDone, setHighlightPhotoDone] = useState(false)
  useEffect(() => {
    if (!highlightProduct?.id) return
    let cancelled = false
    fetch(`${BACKEND_URL}/api/products/${encodeURIComponent(highlightProduct.id)}/photos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return
        const main = data.find((p) => p.is_primary) || data[0]
        if (main?.url) setHighlightPhotoUrl(getBackendFileUrl(main.url))
      })
      .catch(() => {})
      .finally(() => !cancelled && setHighlightPhotoDone(true))
    return () => { cancelled = true }
  }, [highlightProduct?.id])

  return (
    <>
      <HeroCarousel />
      <BrandStrip />

      {/* Product Categories */}
      <section className="py-8 sm:py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="categories-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Product Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {categoriesData.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-sm font-semibold text-primary">New</span>
            <span className="text-sm font-semibold text-gray-500">FEATURED</span>
            <span className="text-sm font-semibold text-gray-500">TOP SELLERS</span>
          </div>
          <h2 id="featured-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {featured.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 bg-primary text-white" aria-label="Company stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{value}</div>
                <div className="text-white/90 mt-1 text-sm sm:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Must-have / Key category */}
      <section className="py-8 sm:py-12 md:py-16 bg-white" aria-labelledby="musthave-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="musthave-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Must-have Products
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Everything you need in one place</p>
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {categoriesData.slice(0, 5).map((cat) => {
              const to = cat.slug === 'hand-tools' ? '/hand-tools' : `/products/category/${cat.slug}`
              return (
                <Link
                  key={cat.id}
                  to={to}
                  className="px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white active:bg-primary-dark transition-colors text-sm font-medium min-h-[44px] inline-flex items-center"
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Power tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {productsData.filter((p) => p.categoryId === 'power-tools').slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Engineered for real work + Similar */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="engineered-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="engineered-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Engineered for Real Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mb-8 sm:mb-12">
            <div className="aspect-square max-w-md w-full mx-auto bg-gray-200 rounded-xl overflow-hidden">
              {highlightPhotoUrl ? (
                <img src={highlightPhotoUrl} alt={highlightProduct.name} className="w-full h-full object-cover" />
              ) : highlightPhotoDone && highlightProduct?.image ? (
                <img src={highlightProduct.image} alt={highlightProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400">{highlightProduct?.name?.charAt(0)}</div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{highlightProduct?.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{highlightProduct?.categoryName} · {highlightProduct?.brand}</p>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">{highlightProduct?.description}</p>
              <Link to={`/products/${highlightProduct?.slug}`} className="inline-flex mt-4 py-2 text-primary font-medium hover:underline min-h-[44px] items-center">
                Read more
              </Link>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
