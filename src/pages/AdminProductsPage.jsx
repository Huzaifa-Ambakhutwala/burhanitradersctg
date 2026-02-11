import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequestWithAuth, getBackendFileUrl } from '../lib/adminApi'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await apiRequestWithAuth(`/api/admin/products${query ? `?q=${encodeURIComponent(query)}` : ''}`)
        if (!cancelled) setProducts(data || [])
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/admin/login')
          return
        }
        if (!cancelled) setError(err.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query, navigate])

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin · Products</h1>
            <p className="text-xs sm:text-sm text-gray-600">Select a product to manage its photos.</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or code"
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        {loading && <p className="text-sm text-gray-600">Loading products…</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => navigate(`/admin/products/${product.id}`)}
                className="text-left bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-3 flex gap-3"
              >
                <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center text-gray-300 text-xl font-bold">
                  {product.image ? (
                    <img
                      src={getBackendFileUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    product.name?.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">{product.id}</div>
                  <div className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{product.brand}</div>
                </div>
              </button>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-gray-600 col-span-full">No products found for this search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

