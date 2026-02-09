import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-7xl sm:text-8xl md:text-9xl font-bold text-gray-200 leading-none">404</p>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-4">Not Found</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md text-sm sm:text-base">
        This is somewhat embarrassing, isn&apos;t it? It looks like nothing was found at this location. Maybe try a search?
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center w-full sm:w-auto px-4">
        <Link to="/" className="inline-flex items-center justify-center bg-primary text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-primary-dark active:bg-primary-dark transition-colors min-h-[48px]">
          Go Home
        </Link>
        <Link to="/contact" className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3.5 rounded-lg font-semibold hover:bg-primary/10 active:bg-primary/20 transition-colors min-h-[48px]">
          Get a Quote
        </Link>
      </div>
    </div>
  )
}
