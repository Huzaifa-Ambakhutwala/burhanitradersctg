import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../context/CategoriesContext'
import { useProducts } from '../context/ProductsContext'
import { useAuth } from '../context/AuthContext'
import { slugify } from '../lib/slugify'
import { categoryPublicPath } from '../lib/catalogPaths'
import { uploadCategoryImage } from '../lib/categoryImages'

export default function AdminCategoriesPage() {
  const { isAdmin } = useAuth()
  const { categories, loading, error, importDefaultCategories, createCategory, updateCategory, deleteCategory } =
    useCategories()
  const { products } = useProducts()

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newOrder, setNewOrder] = useState('')

  const counts = useMemo(() => {
    const m = {}
    for (const p of products) {
      if (!p.categoryId) continue
      m[p.categoryId] = (m[p.categoryId] || 0) + 1
    }
    return m
  }, [products])

  const handleImportDefaults = async () => {
    if (
      !window.confirm(
        'Import the default category set from the website template? Existing categories with the same IDs will be updated.'
      )
    )
      return
    setBusy(true)
    setErr('')
    setMsg('')
    try {
      await importDefaultCategories()
      setMsg('Default categories imported.')
    } catch (e) {
      setErr(e.message || 'Import failed')
    } finally {
      setBusy(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    if (!newName.trim()) return
    setBusy(true)
    try {
      await createCategory({
        name: newName.trim(),
        slug: newSlug.trim() || slugify(newName),
        sortOrder: newOrder === '' ? undefined : Number(newOrder),
      })
      setNewName('')
      setNewSlug('')
      setNewOrder('')
      setMsg('Category created.')
    } catch (e) {
      setErr(e.message || 'Could not create')
    } finally {
      setBusy(false)
    }
  }

  const handleSaveRow = async (payload) => {
    setErr('')
    setMsg('')
    setBusy(true)
    try {
      await updateCategory(payload.id, {
        name: payload.name,
        slug: payload.slug,
        sortOrder: Number(payload.sortOrder) || 0,
        image: payload.image,
      })
      setMsg('Saved.')
    } catch (e) {
      setErr(e.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (cat) => {
    const n = counts[cat.id] || 0
    if (n > 0) {
      setErr(`Move or delete ${n} product(s) first.`)
      return
    }
    if (!window.confirm(`Delete category “${cat.name}”?`)) return
    setBusy(true)
    setErr('')
    try {
      await deleteCategory(cat.id)
      setMsg('Category deleted.')
    } catch (e) {
      setErr(e.message || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const handleCategoryImage = async (categoryId, file) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      await uploadCategoryImage(categoryId, file)
      setMsg('Image updated.')
    } catch (e) {
      setErr(e.message || 'Image upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/products" className="text-sm text-primary hover:underline">
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Categories</h1>
        <p className="text-sm text-gray-600 mt-1">
          Categories appear on the homepage and in navigation. Each product belongs to one category.
        </p>
      </div>

      {(msg || err) && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${err ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-900'}`}>
          {err || msg}
        </div>
      )}

      {isAdmin && (
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={handleImportDefaults}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Import default categories (from template)
          </button>
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-8 p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-900">New category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Slug (optional)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={newOrder}
            onChange={(e) => setNewOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy || !newName.trim()}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          Add category
        </button>
      </form>

      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && categories.length === 0 && (
        <p className="text-sm text-gray-600 py-8">No categories yet. Add one above or import defaults.</p>
      )}

      <div className="space-y-4">
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            productCount={counts[cat.id] || 0}
            busy={busy}
            onSave={handleSaveRow}
            onDelete={handleDelete}
            onImage={(file) => handleCategoryImage(cat.id, file)}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryRow({ cat, productCount, busy, onSave, onDelete, onImage }) {
  const [name, setName] = useState(cat.name)
  const [slug, setSlug] = useState(cat.slug)
  const [order, setOrder] = useState(String(cat.sortOrder ?? 0))
  const [imageUrl, setImageUrl] = useState(cat.image || '')

  useEffect(() => {
    setName(cat.name)
    setSlug(cat.slug)
    setOrder(String(cat.sortOrder ?? 0))
    setImageUrl(cat.image || '')
  }, [cat.id, cat.name, cat.slug, cat.sortOrder, cat.image])

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
      <div className="flex flex-wrap justify-between gap-2">
        <span className="text-xs text-gray-500 font-mono">{cat.id}</span>
        <span className="text-xs text-gray-600">
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Sort order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Image URL (optional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="https://…"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-gray-600">
          Upload image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block mt-1 text-sm"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImage(f)
              e.target.value = ''
            }}
          />
        </label>
        <a
          href={categoryPublicPath(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary font-medium hover:underline"
        >
          View on site →
        </a>
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            onSave({
              id: cat.id,
              name,
              slug,
              sortOrder: order,
              image: imageUrl,
            })
          }
          className="text-sm font-medium px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          disabled={busy || productCount > 0}
          onClick={() => onDelete(cat)}
          className="text-sm font-medium px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
