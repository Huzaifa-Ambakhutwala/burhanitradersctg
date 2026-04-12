import { useState } from 'react'
import { MapPin, Phone, Mail, AlertCircle } from 'lucide-react'
import siteData from '../data/site.json'

/** Production: same-origin /api/contact (Vercel serverless + Nodemailer). Dev: set VITE_CONTACT_API_ORIGIN to a deployed URL, or run `vercel dev`. */
const devApiOrigin = import.meta.env.VITE_CONTACT_API_ORIGIN?.replace(/\/$/, '') || ''

function contactPostUrl() {
  if (import.meta.env.DEV) {
    return devApiOrigin ? `${devApiOrigin}/api/contact` : null
  }
  return '/api/contact'
}

export default function ContactPage() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error | unconfigured | dev_no_api
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const postUrl = contactPostUrl()
  const isDev = import.meta.env.DEV

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!postUrl) {
      setStatus('dev_no_api')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        return
      }
      if (res.status === 503 && data.error === 'not_configured') {
        setStatus('unconfigured')
        return
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Details</h1>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-semibold text-primary">Office Address</div>
                  <p className="text-gray-600 mt-1">{siteData.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-semibold text-primary">Email</div>
                  <a href={`mailto:${siteData.email}`} className="text-gray-600 mt-1 hover:text-primary">
                    {siteData.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-semibold text-primary">Contact Number</div>
                  <a href={`tel:${siteData.phone.replace(/\s/g, '')}`} className="text-gray-600 mt-1 hover:text-primary">
                    {siteData.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Find the Right Tools</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Looking for reliable hardware tools and fittings? Send us your enquiry and our team will get back to you.
            </p>

            {isDev && !postUrl && (
              <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
                <p>
                  <strong className="font-semibold">Local dev:</strong> <code className="rounded bg-amber-100 px-1">npm run dev</code> has no
                  email API. Use <code className="rounded bg-amber-100 px-1">npm run dev:vercel</code> (with SMTP in{' '}
                  <code className="rounded bg-amber-100 px-1">.env.local</code>), or set{' '}
                  <code className="rounded bg-amber-100 px-1">VITE_CONTACT_API_ORIGIN</code> to your Vercel URL to POST against the deployed{' '}
                  <code className="rounded bg-amber-100 px-1">/api/contact</code>. See <code className="rounded bg-amber-100 px-1">.env.example</code>.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment or Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              {status === 'success' && <p className="text-green-600 text-sm">Thank you! We&apos;ll get back to you soon.</p>}
              {status === 'error' && (
                <p className="text-red-600 text-sm">Something went wrong. Please try again or email us directly.</p>
              )}
              {status === 'unconfigured' && (
                <p className="text-red-600 text-sm">
                  Email is not configured on the server yet (missing SMTP settings). Please email us at{' '}
                  <a href={`mailto:${siteData.email}`} className="font-medium underline">
                    {siteData.email}
                  </a>
                  .
                </p>
              )}
              {status === 'dev_no_api' && (
                <p className="text-red-600 text-sm">
                  Cannot send from this dev setup without <code className="text-xs bg-gray-100 px-1 rounded">VITE_CONTACT_API_ORIGIN</code> or{' '}
                  <code className="text-xs bg-gray-100 px-1 rounded">vercel dev</code>. Email us at{' '}
                  <a href={`mailto:${siteData.email}`} className="font-medium underline">
                    {siteData.email}
                  </a>
                  .
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary-dark active:bg-primary-dark disabled:opacity-70 transition-colors min-h-[48px]"
              >
                {status === 'sending' ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
