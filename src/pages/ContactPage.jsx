import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import siteData from '../data/site.json'

export default function ContactPage() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    // Replace with your Formspree endpoint: https://formspree.io/f/YOUR_FORM_ID
    const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ID
      ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
      : null
    try {
      if (formspreeEndpoint) {
        const res = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          setStatus('success')
          setFormData({ name: '', email: '', message: '' })
        } else {
          setStatus('error')
        }
      } else {
        // Demo mode: show success without backend (set VITE_FORMSPREE_ID for real submissions)
        await new Promise((r) => setTimeout(r, 800))
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Details</h1>
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
                  <a href={`mailto:${siteData.email}`} className="text-gray-600 mt-1 hover:text-primary">{siteData.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" aria-hidden />
                </div>
                <div>
                  <div className="font-semibold text-primary">Contact Number</div>
                  <a href={`tel:${siteData.phone.replace(/\s/g, '')}`} className="text-gray-600 mt-1 hover:text-primary">{siteData.phone}</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find the Right Tools</h2>
            <p className="text-gray-600 mb-6">
              Looking for reliable hardware tools and fittings? Send us your enquiry and our team will get back to you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Comment or Message</label>
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
              {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. Please try again or email us directly.</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-70 transition-colors"
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
