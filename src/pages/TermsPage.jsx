import { Link } from 'react-router-dom'
import siteData from '../data/site.json'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms &amp; Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            These terms govern use of the {siteData.name} website. This is a starter template for a business site;
            replace or extend it with terms appropriate for your country, products, and sales process (including
            pricing, delivery, returns, and warranties).
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Use of the website</h2>
          <p>
            You agree to use this site lawfully and not to attempt to disrupt it, scrape it in a way that violates our
            rights or applicable law, or misuse any contact or enquiry features.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Product information</h2>
          <p>
            Catalog content (including descriptions, images, and availability) is provided for general information.
            Specifications and stock should be confirmed with us before you rely on them for purchase or project
            decisions.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Enquiries and quotes</h2>
          <p>
            Messages sent through the site do not form a binding contract. A sale or supply agreement exists only after
            we confirm terms with you in writing or as your usual business process requires.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Limitation of liability</h2>
          <p>
            To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of
            this website. Nothing here excludes liability that cannot be excluded by law.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a href={`mailto:${siteData.email}`} className="text-primary hover:underline">
              {siteData.email}
            </a>
            .
          </p>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {' · '}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  )
}
