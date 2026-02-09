import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    title: 'Quality Tools for Professionals',
    subtitle: 'European-grade tools delivered with authenticity and competitive pricing.',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
  },
  {
    title: 'Hardware for Smart Spaces',
    subtitle: 'Furniture fittings and hardware for smooth performance and long-lasting reliability.',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #075985 0%, #0369a1 50%, #0ea5e9 100%)',
  },
  {
    title: 'Built for Real Work',
    subtitle: 'From workshop to worksites — performance that professionals depend on.',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative overflow-hidden" aria-label="Hero carousel">
      <div className="relative h-[60vh] min-h-[320px] max-h-[520px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: slide.bg,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
            aria-hidden={i !== current}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-2xl">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl">
                {slide.subtitle}
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 bg-white text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {slide.cta}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2" role="tablist" aria-label="Carousel dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
