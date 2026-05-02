import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../context/CategoriesContext'
import { groupProductsByCategory } from '../lib/groupProductsByCategory'
import { categoryPublicPath } from '../lib/catalogPaths'
import { deleteAllProducts } from '../lib/deleteAllProducts'
import {
  buildBulkImportPlan,
  readWorkbookFirstSheetJson,
  writeProductsWorkbook,
} from '../lib/productSpreadsheet'
import { db } from '../lib/firebase'
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore'

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const { products, loading, error, productCount } = useProducts()
  const { categories } = useCategories()
  const [query, setQuery] = useState('')
  const [purgeBusy, setPurgeBusy] = useState(false)
  const [purgeMsg, setPurgeMsg] = useState('')
  const importInputRef = useRef(null)
  const [importBusy, setImportBusy] = useState(false)
  const [importResult, setImportResult] = useState(null)

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

  const handleExportExcel = async () => {
    setImportResult(null)
    try {
      const XLSX = await import('xlsx')
      const api = XLSX.default ?? XLSX
      const wb = writeProductsWorkbook(api, products, categories)
      const d = new Date()
      const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      api.writeFile(wb, `products-export-${stamp}.xlsx`)
    } catch (e) {
      setImportResult({
        kind: 'export',
        message: e?.message || 'Export failed.',
      })
    }
  }

  const commitBulkImport = async (items) => {
    const chunkSize = 400
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)
      const batch = writeBatch(db)
      for (const { docId, payload } of chunk) {
        batch.set(doc(db, 'products', docId), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()
    }
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImportResult(null)
    if (categories.length === 0) {
      setImportResult({
        kind: 'import',
        message: 'Add at least one category before importing products.',
      })
      return
    }
    setImportBusy(true)
    try {
      const buf = await file.arrayBuffer()
      const XLSX = await import('xlsx')
      const api = XLSX.default ?? XLSX
      const { rows } = readWorkbookFirstSheetJson(api, buf)
      if (!rows.length) {
        setImportResult({
          kind: 'import',
          message: 'No rows found in the first sheet. Use the exported template (Products sheet).',
        })
        return
      }
      const { items, errors } = buildBulkImportPlan(rows, categories, products)
      if (items.length === 0) {
        setImportResult({
          kind: 'import',
          message: errors.length
            ? 'No valid rows to import.'
            : 'No product rows found — add productCode and name for each new product.',
          errors,
        })
        return
      }
      await commitBulkImport(items)
      setImportResult({
        kind: 'import',
        created: items.length,
        errors,
      })
    } catch (err) {
      setImportResult({
        kind: 'import',
        message: err?.message || 'Import failed.',
      })
    } finally {
      setImportBusy(false)
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

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900">Bulk import &amp; export</h2>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Export downloads your current catalog as a template (Products + Categories sheets). Add new rows in Excel,
            then import — product images can be added later on each product page.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Export to Excel
            </button>
            <button
              type="button"
              disabled={importBusy}
              onClick={() => importInputRef.current?.click()}
              className="inline-flex items-center justify-center bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              {importBusy ? 'Importing…' : 'Import Excel / CSV'}
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Required columns: <span className="font-mono">productCode</span>, <span className="font-mono">name</span>,
            and category via <span className="font-mono">categoryId</span>, <span className="font-mono">categorySlug</span>, or{' '}
            <span className="font-mono">categoryName</span>. Booleans: yes/no. Leave slug empty to auto-generate from the
            name.
          </p>
          {importResult?.kind === 'export' && importResult.message && (
            <p className="mt-3 text-sm text-red-700">{importResult.message}</p>
          )}
          {importResult?.kind === 'import' && importResult.message && !importResult.created && (
            <p className="mt-3 text-sm text-red-700">{importResult.message}</p>
          )}
          {importResult?.kind === 'import' && importResult.created != null && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50/80 px-3 py-2 text-sm text-green-900">
              <p className="font-medium">Created {importResult.created} product{importResult.created !== 1 ? 's' : ''}.</p>
              {importResult.errors?.length > 0 && (
                <p className="mt-2 text-green-800">
                  {importResult.errors.length} row{importResult.errors.length !== 1 ? 's' : ''} skipped (see below).
                </p>
              )}
            </div>
          )}
          {importResult?.errors?.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950">
              <p className="font-semibold mb-1">Skipped rows</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {importResult.errors.map((err, idx) => (
                  <li key={idx}>
                    Row {err.line}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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

        {isAdmin && (
          <div className="mt-10 p-4 rounded-xl border border-red-200 bg-red-50/80 text-sm">
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
      </div>
    </div>
  )
}
