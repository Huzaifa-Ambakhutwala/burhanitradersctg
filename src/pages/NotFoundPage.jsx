import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <p className="text-8xl md:text-9xl font-bold text-gray-200 leading-none">404</p>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">Not Found</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        This is somewhat embarrassing, isn&apos;t it? It looks like nothing was found at this location. Maybe try a search?
      </p>
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Link to="/" className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          Go Home
        </Link>
        <Link to="/contact" className="inline-flex items-center border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
          Get a Quote
        </Link>
      </div>
    </div>
  )
}
