import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { name, slug, categoryName, categoryId, brand, image, price, showPrice, featured, new: isNew } = product
  const showPriceText = showPrice && price != null ? `৳ ${price}` : 'Inquire for price'

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <Link to={`/products/${slug}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl font-bold">{name.charAt(0)}</div>
        )}
        {(isNew || featured) && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-white">
            {isNew ? 'New' : 'Featured'}
          </span>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/products/category/${categoryId}`} className="text-xs font-medium text-primary hover:underline">
          {categoryName}
        </Link>
        <Link to={`/products/${slug}`}>
          <h3 className="font-semibold text-gray-900 mt-0.5 group-hover:text-primary transition-colors line-clamp-2">{name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{brand}</p>
        <p className="mt-2 text-sm font-medium text-gray-700">{showPriceText}</p>
        <Link
          to={`/products/${slug}`}
          className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Product Details
        </Link>
      </div>
    </article>
  )
}
