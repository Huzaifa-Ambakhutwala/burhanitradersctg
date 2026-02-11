import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'
import categoriesData from '../data/categories.json'
import siteData from '../data/site.json'
import { getBackendFileUrl } from '../lib/adminApi'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = useMemo(() => productsData.find((p) => p.slug === slug), [slug])
  const category = useMemo(() => product && categoriesData.find((c) => c.id === product.categoryId), [product])
  const similar = useMemo(
    () =>
      product
        ? productsData.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3)
        : [],
    [product]
  )

  const [photos, setPhotos] = useState([])
  const [photosLoaded, setPhotosLoaded] = useState(false)

  useEffect(() => {
    if (!product?.id) {
      setPhotosLoaded(true)
      return
    }
    let cancelled = false
    setPhotosLoaded(false)
    fetch(
      `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/products/${encodeURIComponent(
        product.id
      )}/photos`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPhotos(data)
      })
      .catch(() => {})
      .finally(() => !cancelled && setPhotosLoaded(true))
    return () => { cancelled = true }
  }, [product?.id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary font-medium hover:underline">View all products</Link>
      </div>
    )
  }

  const priceText = product.showPrice && product.price != null ? `৳ ${product.price}` : 'Inquire for price'

  const mainPhoto = photos.find((p) => p.is_primary) || photos[0]
  const mainImageUrl = mainPhoto
    ? getBackendFileUrl(mainPhoto.url)
    : photosLoaded
      ? (product.image || null)
      : null

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 break-words" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/products/category/${category.slug}`} className="hover:text-primary">{category.name}</Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
          <div className="aspect-square max-w-sm mx-auto w-full bg-gray-100 rounded-xl overflow-hidden">
            {mainImageUrl ? (
              <img src={mainImageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-gray-300">
                {!photosLoaded ? '' : product.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <Link to={`/products/category/${product.categoryId}`} className="text-sm font-medium text-primary hover:underline">
              {product.categoryName}
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{product.brand}</p>
            <p className="mt-4 text-lg sm:text-xl font-semibold text-gray-900">{priceText}</p>
            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">{product.description}</p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/contact" className="inline-flex items-center justify-center bg-primary text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-primary-dark active:bg-primary-dark transition-colors min-h-[48px] w-full sm:w-auto">
                Get a Quote
              </Link>
              <a
                href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Inquiry for: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-green-600 active:bg-green-700 transition-colors min-h-[48px] w-full sm:w-auto"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-12" aria-labelledby="similar-heading">
            <h2 id="similar-heading" className="text-xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
