import { Link, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { groupProductsByCategory } from '../lib/groupProductsByCategory'
import { categoryPublicPath } from '../lib/catalogPaths'
import { slugify } from '../lib/slugify'

function brandParamFromSearch(searchParams) {
  const raw = searchParams.get('brand')?.trim()
  if (!raw) return ''
  try {
    return slugify(decodeURIComponent(raw))
  } catch {
    return slugify(raw)
  }
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')?.toLowerCase()?.trim() || ''
  const categorySlug = searchParams.get('category')?.trim() || ''
  const brandSlug = brandParamFromSearch(searchParams)
  const { products, loading } = useProducts()
  const { categories } = useCategories()

  const filtered = useMemo(() => {
    let list = products
    if (brandSlug) {
      list = list.filter((p) => slugify(p.brand || '') === brandSlug)
    }
    if (!q) return list
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.id || '').toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    )
  }, [products, q, brandSlug])

  const activeCategory = useMemo(
    () => (categorySlug ? categories.find((c) => c.slug === categorySlug) : null),
    [categorySlug, categories]
  )

  const brandTitle = useMemo(() => {
    if (!brandSlug) return null
    const match = products.find((p) => slugify(p.brand || '') === brandSlug)
    return match?.brand || brandSlug.replace(/-/g, ' ')
  }, [brandSlug, products])

  const groupedAll = useMemo(() => groupProductsByCategory(filtered, categories), [filtered, categories])

  const categoryCounts = useMemo(() => {
    const m = {}
    for (const p of products) {
      const id = p.categoryId || '_other'
      m[id] = (m[id] || 0) + 1
    }
    return m
  }, [products])

  const setCategoryParam = (slug) => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('brand')
    if (slug) next.set('category', slug)
    else next.delete('category')
    setSearchParams(next, { replace: true })
  }

  const setBrandParam = (slug) => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('category')
    if (slug) next.set('brand', slug)
    else next.delete('brand')
    setSearchParams(next, { replace: true })
  }

  const showGroupedBrowse = !q && !activeCategory && !brandSlug

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Products</span>
          {activeCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{activeCategory.name}</span>
            </>
          )}
          {brandTitle && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{brandTitle}</span>
            </>
          )}
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {activeCategory ? activeCategory.name : brandTitle || 'Products'}
        </h1>

        {q && (
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{q}&quot;
          </p>
        )}

        {!q && !activeCategory && !brandSlug && (
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Browse by category or filter to one group. Everything here is managed in the admin portal.
          </p>
        )}

        {!q && !brandSlug && (
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setCategoryParam('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                !activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-800 hover:border-primary/40'
              }`}
            >
              All categories
            </button>
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0
              if (count === 0) return null
              const active = activeCategory?.id === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryParam(cat.slug)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-primary/40'
                  }`}
                >
                  {cat.name}
                  <span className="text-xs opacity-80 ml-1">({count})</span>
                </button>
              )
            })}
          </div>
        )}

        {!q && brandSlug && (
          <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setBrandParam('')}
              className="px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] bg-white border border-gray-200 text-gray-800 hover:border-primary/40"
            >
              Clear brand filter
            </button>
            <span className="text-sm text-gray-600">
              Showing products by <span className="font-semibold text-gray-900">{brandTitle}</span>
            </span>
          </div>
        )}

        {showGroupedBrowse && !loading && (
          <div
            className="sticky top-[3.5rem] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mb-6 bg-gray-50/95 backdrop-blur border-b border-gray-200 sm:border-0"
            aria-label="Jump to category"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Jump to</p>
            <div className="flex flex-wrap gap-2">
              {groupedAll
                .filter((g) => g.products.length > 0)
                .map((g) => (
                  <a
                    key={g.categoryId}
                    href={`#products-cat-${g.categoryId}`}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 hover:border-primary hover:text-primary"
                  >
                    {g.categoryName}
                    <span className="text-gray-500 ml-1">({g.products.length})</span>
                  </a>
                ))}
            </div>
          </div>
        )}

        {loading && <p className="text-gray-600 text-sm py-8">Loading products…</p>}

        {!loading && q && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !q && activeCategory && (
          <>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              {filtered.filter((p) => p.categoryId === activeCategory.id).length} products
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {filtered
                .filter((p) => p.categoryId === activeCategory.id)
                .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </>
        )}

        {!loading && !q && brandSlug && !activeCategory && filtered.length > 0 && (
          <>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {filtered
                .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </>
        )}

        {!loading && showGroupedBrowse && (
          <div className="space-y-12 sm:space-y-14">
            {groupedAll
              .filter((g) => g.products.length > 0)
              .map((group) => (
                <section
                  key={group.categoryId}
                  id={`products-cat-${group.categoryId}`}
                  className="scroll-mt-36 sm:scroll-mt-32"
                  aria-labelledby={`heading-cat-${group.categoryId}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 sm:mb-6 pb-3 border-b border-gray-200">
                    <h2 id={`heading-cat-${group.categoryId}`} className="text-xl sm:text-2xl font-bold text-gray-900">
                      {group.categoryName}
                    </h2>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{group.products.length} products</span>
                      {group.slug && (
                        <Link to={categoryPublicPath(group.slug)} className="font-medium text-primary hover:underline">
                          Category page →
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {group.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !q && activeCategory && (
          <p className="text-gray-500 py-12 text-center">No products in this category yet.</p>
        )}

        {!loading && filtered.length === 0 && !q && brandSlug && !activeCategory && (
          <p className="text-gray-500 py-12 text-center">No products for this brand yet.</p>
        )}

        {!loading && filtered.length === 0 && q && (
          <p className="text-gray-500 py-12 text-center">No products found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}
