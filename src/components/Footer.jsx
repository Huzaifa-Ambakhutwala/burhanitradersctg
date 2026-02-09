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
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{siteData.ctaBanner.headline}</h2>
            <p className="mt-1 text-white/90">{siteData.ctaBanner.subline}</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shrink-0">
            Get a Quote
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Product Categories</h3>
            <ul className="space-y-2 columns-2 gap-x-4">
              {categoriesCol1.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products/category/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Product Categories</h3>
            <ul className="space-y-2 columns-2 gap-x-4">
              {categoriesCol2.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products/category/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                <span>{siteData.address}</span>
              </li>
              <li>
                <a href={`tel:${siteData.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 shrink-0" aria-hidden />
                  {siteData.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteData.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 shrink-0" aria-hidden />
                  {siteData.email}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {Object.entries(siteData.social).map(([key, url]) => {
                if (!url) return null
                const Icon = socialIcons[key]
                if (!Icon) return null
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-800 hover:bg-primary hover:text-white transition-colors" aria-label={key}>
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
