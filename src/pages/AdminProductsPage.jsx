import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { groupProductsByCategory } from '../lib/groupProductsByCategory'
import { categoryPublicPath } from '../lib/catalogPaths'
import { deleteAllProducts } from '../lib/deleteAllProducts'
import { slugify } from '../lib/slugify'
import { db } from '../lib/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const { products, loading, error, productCount } = useProducts()
  const { categories, getCategoryById } = useCategories()
  const [query, setQuery] = useState('')
  const [purgeBusy, setPurgeBusy] = useState(false)
  const [purgeMsg, setPurgeMsg] = useState('')
  const [replicateOpen, setReplicateOpen] = useState(false)
  const [replicateSaving, setReplicateSaving] = useState(false)
  const [replicateError, setReplicateError] = useState('')
  const [replicateSource, setReplicateSource] = useState(null)
  const [replicateForm, setReplicateForm] = useState(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        (p.id || '').toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    )
  }, [products, query])

  const groupedByCategory = useMemo(
    () => groupProductsByCategory(filtered, categories),
    [filtered, categories]
  )

  const handlePurgeAll = async () => {
    if (
      !window.confirm(
        'Delete ALL products and their images from Firestore and Storage? This cannot be undone. Categories are kept.'
      )
    )
      return
    if (!window.confirm('Are you sure? Type OK in your mind and click OK.')) return
    setPurgeBusy(true)
    setPurgeMsg('')
    try {
      await deleteAllProducts((done, total) => {
        setPurgeMsg(`Removing… ${done} / ${total}`)
      })
      setPurgeMsg('All products removed.')
    } catch (e) {
      setPurgeMsg(e.message || 'Failed to delete all')
    } finally {
      setPurgeBusy(false)
    }
  }

  const openReplicate = (product) => {
    const baseId = `${product.id}-copy`
    const existing = new Set(products.map((p) => p.id))
    let nextId = baseId
    let i = 2
    while (existing.has(nextId)) {
      nextId = `${baseId}-${i}`
      i += 1
    }

    const categoryId = product.categoryId || categories[0]?.id || ''
    const category = categoryId ? getCategoryById(categoryId) : null
    const name = (product.name || '').trim()
    setReplicateSource(product)
    setReplicateForm({
      productCode: nextId,
      name,
      slug: slugify(name),
      categoryId,
      brand: product.brand || '',
      description: product.description || '',
      price: product.price != null ? String(product.price) : '',
      showPrice: !!product.showPrice,
      featured: !!product.featured,
      topSeller: !!product.topSeller,
      isNew: !!product.new,
      categoryName: category?.name || product.categoryName || '',
      categorySlug: category?.slug || product.categorySlug || '',
    })
    setReplicateError('')
    setReplicateOpen(true)
  }

  const closeReplicate = () => {
    if (replicateSaving) return
    setReplicateOpen(false)
    setReplicateSource(null)
    setReplicateForm(null)
    setReplicateError('')
  }

  const saveReplicated = async () => {
    if (!replicateForm || !user) return
    setReplicateError('')
    const docId = replicateForm.productCode.trim().replace(/\s+/g, '-')
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(docId)) {
      setReplicateError('Product code: use letters, numbers, dashes or underscores (max 80).')
      return
    }
    if (docId.toLowerCase() === 'new') {
      setReplicateError('Product code cannot be \"new\" (reserved).')
      return
    }
    const name = replicateForm.name.trim()
    const categoryId = replicateForm.categoryId
    const slug = slugify(replicateForm.slug || name)
    if (!name || !categoryId || !slug) {
      setReplicateError('Name, URL slug, and category are required.')
      return
    }
    if (products.some((p) => p.id === docId)) {
      setReplicateError('Another product already uses this product code.')
      return
    }
    if (products.some((p) => p.slug === slug)) {
      setReplicateError('Another product already uses this URL slug.')
      return
    }
    const cat = getCategoryById(categoryId)
    const priceNum = replicateForm.price === '' ? null : Number(replicateForm.price)
    if (replicateForm.price !== '' && Number.isNaN(priceNum)) {
      setReplicateError('Price must be a number.')
      return
    }

    setReplicateSaving(true)
    try {
      await setDoc(
        doc(db, 'products', docId),
        {
          name,
          slug,
          categoryId,
          categoryName: cat?.name || '',
          categorySlug: cat?.slug || '',
          brand: (replicateForm.brand || '').trim(),
          description: (replicateForm.description || '').trim(),
          price: priceNum,
          showPrice: !!replicateForm.showPrice,
          featured: !!replicateForm.featured,
          topSeller: !!replicateForm.topSeller,
          new: !!replicateForm.isNew,
          image: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          replicatedFrom: replicateSource?.id || null,
          replicatedBy: user.uid,
        },
        { merge: true }
      )
      closeReplicate()
      navigate(`/admin/products/${docId}`)
    } catch (e) {
      setReplicateError(e.message || 'Failed to create product')
    } finally {
      setReplicateSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-600 mt-1">
              {productCount} product{productCount !== 1 ? 's' : ''} · Add, edit, and upload photos per item.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark"
            >
              + Add product
            </Link>
            <Link
              to="/admin/categories"
              className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Categories
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50/80 text-sm">
            <p className="font-semibold text-red-900">Danger zone</p>
            <p className="text-red-800 mt-1">Remove every product to start from scratch (images deleted too).</p>
            <button
              type="button"
              disabled={purgeBusy || productCount === 0}
              onClick={handlePurgeAll}
              className="mt-3 px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 disabled:opacity-50"
            >
              {purgeBusy ? 'Deleting…' : 'Delete all products'}
            </button>
            {purgeMsg && <p className="mt-2 text-red-900">{purgeMsg}</p>}
          </div>
        )}

        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, code, or brand"
            className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        {!loading && !error && groupedByCategory.some((g) => g.products.length > 0) && (
          <div
            className="sticky top-0 z-10 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mb-6 bg-gray-100/95 backdrop-blur border-b border-gray-200 sm:border-0 rounded-lg sm:rounded-none"
            aria-label="Jump to category"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Jump to category</p>
            <div className="flex flex-wrap gap-2">
              {groupedByCategory
                .filter((g) => g.products.length > 0)
                .map((g) => (
                  <a
                    key={g.categoryId}
                    href={`#admin-cat-${g.categoryId}`}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 hover:border-primary hover:text-primary"
                  >
                    {g.categoryName}
                    <span className="text-gray-500 ml-1">({g.products.length})</span>
                  </a>
                ))}
            </div>
          </div>
        )}

        {loading && <p className="text-sm text-gray-600">Loading products…</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {!loading && !error && productCount === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-800 font-medium">No products yet</p>
            <p className="text-sm text-gray-600 mt-2">
              Add categories first if needed, then create your first product.
            </p>
            <Link
              to="/admin/products/new"
              className="inline-flex mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Add product
            </Link>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            {groupedByCategory.map((group) => (
              <section
                key={group.categoryId}
                id={`admin-cat-${group.categoryId}`}
                className="scroll-mt-24"
                aria-labelledby={`admin-cat-title-${group.categoryId}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 pb-2 border-b border-gray-200">
                  <h2 id={`admin-cat-title-${group.categoryId}`} className="text-lg font-bold text-gray-900">
                    {group.categoryName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{group.products.length} products</span>
                    {group.slug && (
                      <a
                        href={categoryPublicPath(group.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        View on site
                      </a>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.products.map((product) => {
                    const thumb = product.primaryImageUrl || product.image
                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-3 flex gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="flex gap-3 flex-1 text-left min-w-0"
                        >
                          <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center text-gray-300 text-xl font-bold shrink-0">
                            {thumb ? (
                              <img src={thumb} alt="" className="w-full h-full object-cover" />
                            ) : (
                              product.name?.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-500 mb-0.5">{product.id}</div>
                            <div className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{product.brand}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.featured && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Featured</span>
                              )}
                              {product.topSeller && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-900">Top seller</span>
                              )}
                              {product.new && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-900">New</span>
                              )}
                            </div>
                          </div>
                        </button>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openReplicate(product)}
                            className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 hover:border-primary/40 hover:text-primary min-h-[36px]"
                            title="Replicate this product"
                          >
                            Replicate
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
            {filtered.length === 0 && productCount > 0 && (
              <p className="text-sm text-gray-600">No products match this search.</p>
            )}
          </div>
        )}
      </div>

      {replicateOpen && replicateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Replicate product">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeReplicate}
            aria-label="Close"
          />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">Replicate product</h2>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">
                    From <span className="font-mono">{replicateSource?.id}</span> — {replicateSource?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeReplicate}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
                  disabled={replicateSaving}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {replicateError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{replicateError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product code (ID)</label>
                  <input
                    type="text"
                    value={replicateForm.productCode}
                    onChange={(e) => setReplicateForm((f) => ({ ...f, productCode: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                    placeholder="e.g. WP212007-copy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={replicateForm.categoryId}
                    onChange={(e) => setReplicateForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={replicateForm.name}
                  onChange={(e) => setReplicateForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL slug</label>
                <input
                  type="text"
                  value={replicateForm.slug}
                  onChange={(e) => setReplicateForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                  placeholder={slugify(replicateForm.name) || 'product-url'}
                />
                <button
                  type="button"
                  className="mt-1 text-xs text-primary hover:underline"
                  onClick={() => setReplicateForm((f) => ({ ...f, slug: slugify(f.name) }))}
                >
                  Generate from name
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={replicateForm.brand}
                    onChange={(e) => setReplicateForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (optional)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={replicateForm.price}
                    onChange={(e) => setReplicateForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g. 1500"
                  />
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={replicateForm.showPrice}
                      onChange={(e) => setReplicateForm((f) => ({ ...f, showPrice: e.target.checked }))}
                    />
                    <span className="text-sm text-gray-800">Show price on website</span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={replicateForm.description}
                  onChange={(e) => setReplicateForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="mt-4">
                <span className="block text-sm font-medium text-gray-700 mb-2">Storefront tags</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={replicateForm.featured}
                      onChange={(e) => setReplicateForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={replicateForm.topSeller}
                      onChange={(e) => setReplicateForm((f) => ({ ...f, topSeller: e.target.checked }))}
                    />
                    <span className="text-sm">Top seller</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={replicateForm.isNew}
                      onChange={(e) => setReplicateForm((f) => ({ ...f, isNew: e.target.checked }))}
                    />
                    <span className="text-sm">New</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={closeReplicate}
                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
                disabled={replicateSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveReplicated}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
                disabled={replicateSaving}
              >
                {replicateSaving ? 'Creating…' : 'Create product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
