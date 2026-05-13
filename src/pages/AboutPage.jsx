import siteData from '../data/site.json'

function BulletList({ items }) {
  if (!items?.length) return null
  return (
    <ul className="mt-4 space-y-2.5 text-gray-600 list-disc pl-5 sm:pl-6">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function AboutPage() {
  const { about, name } = siteData
  const sections = Array.isArray(about?.sections) ? about.sections : []

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          {name.toUpperCase()}
        </h1>
        {about?.subheadline && (
          <p className="mt-3 text-lg sm:text-xl text-primary font-semibold leading-snug">
            {about.subheadline}
          </p>
        )}

        <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-12">
          {sections.map((section, idx) => (
            <section key={idx} aria-labelledby={`about-section-${idx}`}>
              <h2 id={`about-section-${idx}`} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed">
                  {p}
                </p>
              ))}
              <BulletList items={section.bullets} />
              {section.paragraphsAfterBullets?.map((p, i) => (
                <p key={`after-${i}`} className="text-gray-600 leading-relaxed mt-4">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {about?.closingLine && (
          <p className="mt-12 sm:mt-14 pt-8 border-t border-gray-200 text-center text-gray-800 font-semibold text-lg">
            {name} — {about.closingLine}
          </p>
        )}
      </div>
    </div>
  )
}
