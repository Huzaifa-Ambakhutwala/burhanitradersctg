import { Link } from 'react-router-dom'
import productsData from '../data/products.json'
import { getHandToolsCategories, getHandToolsProductsByCategoryId } from '../lib/handTools'

export default function HandToolsPage() {
  const categories = getHandToolsCategories().filter((c) => c.id !== 'other-hand-tools')

  return (
    <main className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">Hand tools</li>
          </ol>
        </nav>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hand tools</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Browse hand tools by category to quickly find the right WORKPRO product for your job.
          </p>
        </header>

        <section aria-label="Hand tools categories">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => {
              const items = getHandToolsProductsByCategoryId(productsData, category.id)
              const count = items.length

              if (count === 0) return null

              return (
                <Link
                  key={category.id}
                  to={`/hand-tools/${category.id}`}
                  className="group block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 active:border-primary/40 transition-all min-h-[44px]"
                >
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-300 group-hover:text-primary/60 transition-colors">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">
                      {category.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {count} product{count !== 1 ? 's' : ''}
                    </p>
                    {category.description && (
                      <p className="mt-1 text-[11px] sm:text-xs text-gray-500 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

