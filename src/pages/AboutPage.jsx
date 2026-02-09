import siteData from '../data/site.json'

export default function AboutPage() {
  const { about } = siteData

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          About {siteData.name}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">{about.intro}</p>
        <p className="text-gray-600 mt-4 leading-relaxed">{about.intro2}</p>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 sm:mt-12 mb-4">Why Us?</h2>
        <ul className="space-y-3 text-gray-600">
          {about.whyUs.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1" aria-hidden>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 sm:mt-12 mb-4">Our Vision</h2>
        <p className="text-gray-600 leading-relaxed">{about.vision}</p>
      </div>
    </div>
  )
}
