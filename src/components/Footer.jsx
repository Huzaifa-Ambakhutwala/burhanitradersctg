import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import siteData from '../data/site.json'
import categoriesData from '../data/categories.json'

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

export default function Footer() {
  const categoriesCol1 = categoriesData.slice(0, 6)
  const categoriesCol2 = categoriesData.slice(6, 12)

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA strip */}
      <div className="bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{siteData.ctaBanner.headline}</h2>
            <p className="mt-1 text-white/90 text-sm sm:text-base">{siteData.ctaBanner.subline}</p>
          </div>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-primary-dark px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0 min-h-[48px] w-full sm:w-auto">
            Get a Quote
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              {['Home', 'Products', 'About Us', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'].map((label, i) => {
                const to = label === 'Home' ? '/' : label === 'Products' ? '/products' : label === 'About Us' ? '/about' : '/contact'
                return (
                  <li key={label}>
                    <Link to={to} className="block py-2.5 sm:py-1.5 hover:text-white active:text-white/90 transition-colors -mx-1 px-1 rounded">{label}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Product Categories</h3>
            <ul className="space-y-1 sm:space-y-2 md:columns-2 md:gap-x-4">
              {categoriesCol1.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products/category/${cat.slug}`} className="block py-2.5 sm:py-1.5 hover:text-white active:text-white/90 transition-colors -mx-1 px-1 rounded">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Product Categories</h3>
            <ul className="space-y-1 sm:space-y-2 md:columns-2 md:gap-x-4">
              {categoriesCol2.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products/category/${cat.slug}`} className="block py-2.5 sm:py-1.5 hover:text-white active:text-white/90 transition-colors -mx-1 px-1 rounded">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                <span className="text-sm sm:text-base">{siteData.address}</span>
              </li>
              <li>
                <a href={`tel:${siteData.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white active:text-white/90 transition-colors py-1.5 -my-1.5">
                  <Phone className="w-5 h-5 shrink-0" aria-hidden />
                  <span>{siteData.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteData.email}`} className="flex items-center gap-2 hover:text-white active:text-white/90 transition-colors py-1.5 -my-1.5 break-all">
                  <Mail className="w-5 h-5 shrink-0" aria-hidden />
                  <span>{siteData.email}</span>
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4 flex-wrap">
              {Object.entries(siteData.social).map(([key, url]) => {
                if (!url) return null
                const Icon = socialIcons[key]
                if (!Icon) return null
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-800 hover:bg-primary hover:text-white active:bg-primary-dark transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={key}>
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {siteData.name}</p>
        </div>
      </div>
    </footer>
  )
}
