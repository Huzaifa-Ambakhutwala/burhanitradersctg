import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  const { name, slug, productCount, image } = category
  return (
    <Link
      to={`/products/category/${slug}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 active:border-primary/40 transition-all min-h-[44px]"
    >
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <span className="text-3xl sm:text-4xl font-bold text-gray-300 group-hover:text-primary/50 transition-colors">{name.charAt(0)}</span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{productCount} products</p>
      </div>
    </Link>
  )
}
