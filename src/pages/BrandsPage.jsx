import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useProducts } from '../context/ProductsContext'
import { slugify } from '../lib/slugify'

export default function BrandsPage() {
  const { products, loading } = useProducts()

  const brands = useMemo(() => {
    const m = new Map()
    for (const p of products) {
      const name = (p.brand || '').trim()
      if (!name) continue
      const key = slugify(name)
      const prev = m.get(key)
      if (!prev) m.set(key, { slug: key, name, count: 1 })
      else m.set(key, { ...prev, count: prev.count + 1 })
    }
    return Array.from(m.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Brands</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Brands</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Browse products by brand.
        </p>

        {loading && <p className="text-gray-600 text-sm py-8">Loading brands…</p>}

        {!loading && brands.length === 0 && (
          <p className="text-gray-500 py-12 text-center">No brands found yet.</p>
        )}

        {!loading && brands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {brands.map((b) => (
              <Link
                key={b.slug}
                to={`/products?brand=${encodeURIComponent(b.slug)}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{b.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{b.count} product{b.count !== 1 ? 's' : ''}</div>
                  </div>
                  <span className="text-sm font-medium text-primary">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

