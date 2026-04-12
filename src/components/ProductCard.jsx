import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useCategories } from '../context/CategoriesContext'
import { categoryPublicPath } from '../lib/catalogPaths'

export default function ProductCard({ product }) {
  const { name, slug, categoryName, categoryId, brand, image, price, showPrice, featured, new: isNew, topSeller } =
    product
  const { getCategoryById } = useCategories()

  const categoryPath = useMemo(() => {
    const s = product.categorySlug || getCategoryById(categoryId)?.slug
    return s ? categoryPublicPath(s) : '/products'
  }, [product.categorySlug, categoryId, getCategoryById])

  const showPriceText = showPrice && price != null ? `৳ ${price}` : 'Inquire for price'
  const thumb = product.primaryImageUrl || image

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <Link to={`/products/${slug}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl sm:text-6xl font-bold">
            {name.charAt(0)}
          </div>
        )}
        {(isNew || featured || topSeller) && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-white">
            {isNew ? 'New' : topSeller ? 'Top seller' : 'Featured'}
          </span>
        )}
      </Link>
      <div className="p-3 sm:p-4 flex-1 flex flex-col min-w-0">
        <Link to={categoryPath} className="text-xs font-medium text-primary hover:underline py-0.5">
          {categoryName}
        </Link>
        <Link to={`/products/${slug}`} className="min-h-[44px] flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 mt-0.5 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
            {name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{brand}</p>
        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700">{showPriceText}</p>
        <Link
          to={`/products/${slug}`}
          className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline py-2 -mb-1 min-h-[44px]"
        >
          View details
        </Link>
      </div>
    </article>
  )
}
