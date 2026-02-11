import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiRequestWithAuth, getBackendFileUrl } from '../lib/adminApi'

export default function AdminProductPhotosPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequestWithAuth(`/api/admin/products/${id}`)
      setProduct(data.product)
      setPhotos(data.photos || [])
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/admin/login')
        return
      }
      setError(err.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []))
  }

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      // Upload sequentially for simplicity
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const token = localStorage.getItem('bt_admin_token')
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/admin/products/${encodeURIComponent(
            id
          )}/photos`,
          {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        )
      }
      setFiles([])
      await load()
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await apiRequestWithAuth(`/api/admin/photos/${photoId}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message || 'Failed to delete photo')
    }
  }

  const handleMakePrimary = async (photoId) => {
    try {
      await apiRequestWithAuth(`/api/admin/photos/${photoId}`, { method: 'PATCH' })
      await load()
    } catch (err) {
      setError(err.message || 'Failed to update primary photo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-sm text-primary hover:underline mb-3"
        >
          ← Back to products
        </button>

        {loading && <p className="text-sm text-gray-600">Loading…</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {product && (
          <>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {product.name} <span className="text-xs text-gray-500 font-normal">({product.id})</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">{product.brand}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">Existing photos</h2>
                {photos.length === 0 ? (
                  <p className="text-sm text-gray-600">No photos uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col"
                      >
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={getBackendFileUrl(photo.url)}
                            alt={photo.caption || product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                          {photo.is_primary ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 w-max">
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakePrimary(photo.id)}
                              className="text-[11px] text-primary hover:underline text-left"
                            >
                              Make primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(photo.id)}
                            className="text-[11px] text-red-600 hover:underline text-left"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-800 mb-3">Upload new photos</h2>
                <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                  {files.length > 0 && (
                    <p className="mt-2 text-xs text-gray-600">{files.length} file(s) selected.</p>
                  )}
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className="mt-3 w-full inline-flex items-center justify-center bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                  <p className="mt-2 text-[11px] text-gray-500">
                    JPEG, PNG or WEBP. Max 10MB per file. For best results, use square or 4:3 images.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

