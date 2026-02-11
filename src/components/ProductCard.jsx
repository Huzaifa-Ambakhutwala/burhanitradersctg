import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBackendFileUrl } from '../lib/adminApi'

export default function ProductCard({ product }) {
  const { id, name, slug, categoryName, categoryId, brand, image, price, showPrice, featured, new: isNew } = product
  const showPriceText = showPrice && price != null ? `৳ ${price}` : 'Inquire for price'

  const [photoUrl, setPhotoUrl] = useState(null)
  const [photoFetched, setPhotoFetched] = useState(false)

  useEffect(() => {
    if (!id) {
      setPhotoFetched(true)
      return
    }
    let cancelled = false
    setPhotoFetched(false)
    fetch(
      `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/products/${encodeURIComponent(
        id
      )}/photos`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return
        const main = Array.isArray(data) && data.length > 0 ? (data.find((p) => p.is_primary) || data[0]) : null
        setPhotoUrl(main?.url ? getBackendFileUrl(main.url) : null)
      })
      .catch(() => setPhotoUrl(null))
      .finally(() => !cancelled && setPhotoFetched(true))
    return () => { cancelled = true }
  }, [id])

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <Link to={`/products/${slug}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : photoFetched && image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl sm:text-6xl font-bold">
            {photoFetched ? name.charAt(0) : ''}
          </div>
        )}
        {(isNew || featured) && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-white">
            {isNew ? 'New' : 'Featured'}
          </span>
        )}
      </Link>
      <div className="p-3 sm:p-4 flex-1 flex flex-col min-w-0">
        <Link to={`/products/category/${categoryId}`} className="text-xs font-medium text-primary hover:underline py-0.5">
          {categoryName}
        </Link>
        <Link to={`/products/${slug}`} className="min-h-[44px] flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 mt-0.5 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">{name}</h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{brand}</p>
        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700">{showPriceText}</p>
        <Link
          to={`/products/${slug}`}
          className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline py-2 -mb-1 min-h-[44px]"
        >
          Product Details
        </Link>
      </div>
    </article>
  )
}
