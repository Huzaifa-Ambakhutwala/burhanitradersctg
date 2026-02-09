import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'
import categoriesData from '../data/categories.json'
import siteData from '../data/site.json'

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary font-medium hover:underline">View all products</Link>
      </div>
    )
  }

  const priceText = product.showPrice && product.price != null ? `৳ ${product.price}` : 'Inquire for price'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
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

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-gray-300">{product.name.charAt(0)}</div>
            )}
          </div>
          <div>
            <Link to={`/products/category/${product.categoryId}`} className="text-sm font-medium text-primary hover:underline">
              {product.categoryName}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.brand}</p>
            <p className="mt-4 text-xl font-semibold text-gray-900">{priceText}</p>
            <p className="mt-6 text-gray-600">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Get a Quote
              </Link>
              <a
                href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Inquiry for: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
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
