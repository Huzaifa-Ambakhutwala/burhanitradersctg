import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { useCategories } from '../context/CategoriesContext'
import { db } from '../lib/firebase'
import { slugify } from '../lib/slugify'
import {
  deleteProductImage,
  listProductImages,
  setPrimaryImage,
  uploadProductImage,
} from '../lib/productImages'

const emptyForm = {
  productCode: '',
  name: '',
  slug: '',
  categoryId: '',
  brand: '',
  description: '',
  price: '',
  showPrice: false,
  featured: false,
  topSeller: false,
  isNew: false,
  image: '',
}

export default function AdminProductEditPage() {
  const { productId } = useParams()
  const location = useLocation()
  const isNew = location.pathname.endsWith('/products/new')
  const id = isNew ? null : productId

  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories, getCategoryById } = useCategories()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState([])
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (cancelled) return
        if (!snap.exists()) {
          setError('Product not found')
          setLoading(false)
          return
        }
        const p = snap.data()
        setForm({
          productCode: snap.id,
          name: p.name || '',
          slug: p.slug || '',
          categoryId: p.categoryId || '',
          brand: p.brand || '',
          description: p.description || '',
          price: p.price != null ? String(p.price) : '',
          showPrice: !!p.showPrice,
          featured: !!p.featured,
          topSeller: !!p.topSeller,
          isNew: !!p.new,
          image: p.image || '',
        })
        const imgs = await listProductImages(id)
        if (!cancelled) setPhotos(imgs)
        if (!cancelled) {
          try {
            const w = sessionStorage.getItem(`product-upload-warn-${id}`)
            if (w) {
              setError(w)
              sessionStorage.removeItem(`product-upload-warn-${id}`)
            }
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew, categories])

  useEffect(() => {
    if (!isNew || categories.length === 0) return
    setForm((f) => {
      if (f.categoryId) return f
      return { ...f, categoryId: categories[0].id }
    })
  }, [isNew, categories])

  const applyCategoryMeta = (categoryId) => {
    const cat = getCategoryById(categoryId)
    return {
      categoryName: cat?.name || '',
      categorySlug: cat?.slug || '',
    }
  }

  const slugTaken = async (slug, excludeId) => {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(3))
    const snap = await getDocs(q)
    return snap.docs.some((d) => d.id !== excludeId)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    const name = form.name.trim()
    const slug = slugify(form.slug || name)
    const categoryId = form.categoryId
    if (!name || !slug || !categoryId) {
      setError('Name, URL slug, and category are required.')
      return
    }

    let docId = id
    if (isNew) {
      docId = form.productCode.trim().replace(/\s+/g, '-')
      if (!/^[a-zA-Z0-9_-]{1,80}$/.test(docId)) {
        setError('Product code: use letters, numbers, dashes or underscores (max 80).')
        return
      }
      if (docId.toLowerCase() === 'new') {
        setError('Product code cannot be "new" (reserved).')
        return
      }
    }

    const meta = applyCategoryMeta(categoryId)
    const priceNum = form.price === '' ? null : Number(form.price)
    if (form.price !== '' && Number.isNaN(priceNum)) {
      setError('Price must be a number.')
      return
    }

    setSaving(true)
    try {
      if (await slugTaken(slug, docId)) {
        setError('Another product already uses this URL slug. Change the slug.')
        setSaving(false)
        return
      }
      const payload = {
        name,
        slug,
        categoryId,
        categoryName: meta.categoryName,
        categorySlug: meta.categorySlug,
        brand: form.brand.trim(),
        description: form.description.trim(),
        price: priceNum,
        showPrice: !!form.showPrice,
        featured: !!form.featured,
        topSeller: !!form.topSeller,
        new: !!form.isNew,
        image: form.image.trim() || null,
        updatedAt: serverTimestamp(),
      }
      if (isNew) {
        payload.createdAt = serverTimestamp()
      }
      await setDoc(doc(db, 'products', docId), payload, { merge: true })

      if (isNew && files.length > 0 && user) {
        try {
          for (const file of files) {
            await uploadProductImage(docId, file, user.uid)
          }
          setFiles([])
        } catch (uploadErr) {
          const msg =
            uploadErr?.message || 'Product was saved, but one or more photos failed to upload. Try again below.'
          try {
            sessionStorage.setItem(`product-upload-warn-${docId}`, msg)
          } catch {
            /* ignore */
          }
        }
      }

      if (isNew) {
        navigate(`/admin/products/${docId}`, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const reloadPhotos = async () => {
    if (!id) return
    setPhotos(await listProductImages(id))
  }

  const handleUpload = async () => {
    if (!id || !files.length || !user) return
    setUploading(true)
    setError('')
    try {
      for (const file of files) {
        await uploadProductImage(id, file, user.uid)
      }
      setFiles([])
      await reloadPhotos()
    } catch (e) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photo) => {
    if (!id || !window.confirm('Delete this photo?')) return
    try {
      await deleteProductImage(id, photo.id, photo)
      await reloadPhotos()
    } catch (e) {
      setError(e.message || 'Delete failed')
    }
  }

  const handlePrimary = async (photoId) => {
    if (!id) return
    try {
      await setPrimaryImage(id, photoId)
      await reloadPhotos()
    } catch (e) {
      setError(e.message || 'Update failed')
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600">Loading product…</div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/products" className="text-sm text-primary hover:underline">
          ← Back to products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{isNew ? 'Add product' : 'Edit product'}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Details appear on the storefront. Upload images and set a primary photo for thumbnails.
        </p>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        {isNew && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product code (ID)</label>
            <input
              type="text"
              value={form.productCode}
              onChange={(e) => setForm((f) => ({ ...f, productCode: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. WP212007"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Used as the internal ID; cannot be changed later.</p>
          </div>
        )}

        {!isNew && (
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">Product code</span>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">{id}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            placeholder={slugify(form.name) || 'product-url'}
          />
          <p className="text-xs text-gray-500 mt-1">
            This becomes the product link on the public site:{' '}
            <span className="font-mono text-gray-600">/products/</span>
            <span className="font-mono text-primary">{slugify(form.slug || form.name) || 'your-slug'}</span>. Use lowercase words
            separated by hyphens; it must be unique.
          </p>
          <button
            type="button"
            className="mt-1 text-xs text-primary hover:underline"
            onClick={() => setForm((f) => ({ ...f, slug: slugify(f.name) }))}
          >
            Generate from name
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-amber-700 mt-1">
              No categories yet.{' '}
              <Link to="/admin/categories" className="underline">
                Create categories first
              </Link>
              .
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (optional)</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 1500"
            />
          </div>
          <label className="flex items-center gap-2 mt-6 sm:mt-8">
            <input
              type="checkbox"
              checked={form.showPrice}
              onChange={(e) => setForm((f) => ({ ...f, showPrice: e.target.checked }))}
            />
            <span className="text-sm text-gray-800">Show price on website</span>
          </label>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Storefront tags</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.topSeller}
                onChange={(e) => setForm((f) => ({ ...f, topSeller: e.target.checked }))}
              />
              <span className="text-sm">Top seller</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
              />
              <span className="text-sm">New</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">External image URL (optional, legacy)</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="https://…"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only for pictures still hosted outside Firebase (e.g. old imports). The storefront prefers{' '}
            <strong className="font-medium text-gray-600">uploaded photos</strong> (primary image below). Leave empty if you use uploads only.
          </p>
        </div>

        {isNew && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/80 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos (optional)</label>
            <p className="text-xs text-gray-500 mb-2">
              JPEG, PNG, or WebP. They are saved to Firebase Storage right after you click &quot;Save product&quot;. First image becomes the
              primary thumbnail unless you change it on the next screen.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:text-xs file:font-semibold"
            />
            {files.length > 0 && <p className="text-xs text-gray-600 mt-2">{files.length} file(s) ready to upload after save</p>}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || (!isNew && !id)}
            className="inline-flex items-center justify-center bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? (isNew && files.length > 0 ? 'Saving & uploading…' : 'Saving…') : 'Save product'}
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>

      {!isNew && id && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product images</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {photos.length === 0 ? (
                <p className="text-sm text-gray-600">No images yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                      <div className="aspect-square bg-gray-100">
                        <img src={photo.downloadURL} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        {photo.isPrimary ? (
                          <span className="text-[11px] font-medium text-emerald-700">Primary</span>
                        ) : (
                          <button type="button" className="text-[11px] text-primary text-left" onClick={() => handlePrimary(photo.id)}>
                            Set primary
                          </button>
                        )}
                        <button type="button" className="text-[11px] text-red-600 text-left" onClick={() => handleDeletePhoto(photo)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="block w-full text-sm file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:text-xs file:font-semibold"
              />
              {files.length > 0 && <p className="text-xs text-gray-600 mt-2">{files.length} file(s)</p>}
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="mt-3 w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload images'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
