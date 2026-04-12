import { Link } from 'react-router-dom'
import siteData from '../data/site.json'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            {siteData.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page describes how we handle
            information when you use our website at a high level. You may replace this text with a policy drafted for
            your jurisdiction and practices.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Information we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-gray-800">Contact form:</strong> If you submit our enquiry form, we receive the
              name, email, and message you provide so we can respond.
            </li>
            <li>
              <strong className="text-gray-800">Admin sign-in:</strong> Staff who sign in with Google authenticate
              through Google; we store account details needed to operate the business catalog (for example email and
              display name) as described in your Firebase and Google settings.
            </li>
            <li>
              <strong className="text-gray-800">Usage data:</strong> Standard server, hosting, or analytics tools may
              log technical data (such as IP address, browser type, and pages viewed) according to those services&apos;
              policies.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">How we use information</h2>
          <p>We use the information above to reply to enquiries, operate our website and catalog, and improve our service.</p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Contact</h2>
          <p>
            For privacy-related questions, contact us at{' '}
            <a href={`mailto:${siteData.email}`} className="text-primary hover:underline">
              {siteData.email}
            </a>
            .
          </p>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
          {' · '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms &amp; Conditions
          </Link>
        </p>
      </div>
    </div>
  )
}
