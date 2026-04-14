import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Phone, Mail, ChevronDown, Shield, LogOut } from 'lucide-react'
import siteData from '../data/site.json'
import { useAuth } from '../context/AuthContext'
import { useCategories } from '../context/CategoriesContext'
import { categoryPublicPath } from '../lib/catalogPaths'
import UserAvatar from './UserAvatar'
import { useProducts } from '../context/ProductsContext'
import { slugify } from '../lib/slugify'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const accountRef = useRef(null)
  const categoriesRef = useRef(null)
  const brandsRef = useRef(null)
  const closeTimers = useRef({ categories: null, brands: null })
  const navigate = useNavigate()
  const { user, profile, loading, signOut, isStaff, isPending } = useAuth()
  const { categories } = useCategories()
  const { products } = useProducts()

  useEffect(() => {
    const close = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false)
      }
      if (brandsRef.current && !brandsRef.current.contains(e.target)) {
        setBrandsOpen(false)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimers.current.categories) clearTimeout(closeTimers.current.categories)
      if (closeTimers.current.brands) clearTimeout(closeTimers.current.brands)
    }
  }, [])

  const brandList = useMemo(() => {
    const m = new Map()
    for (const p of products || []) {
      const name = (p.brand || '').trim()
      if (!name) continue
      const key = slugify(name)
      const prev = m.get(key)
      if (!prev) m.set(key, { slug: key, name })
    }
    return Array.from(m.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }, [products])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  const openDropdown = (which) => {
    if (which === 'categories') {
      if (closeTimers.current.categories) clearTimeout(closeTimers.current.categories)
      setCategoriesOpen(true)
      setBrandsOpen(false)
    }
    if (which === 'brands') {
      if (closeTimers.current.brands) clearTimeout(closeTimers.current.brands)
      setBrandsOpen(true)
      setCategoriesOpen(false)
    }
  }

  const scheduleCloseDropdown = (which, e) => {
    const ref = which === 'categories' ? categoriesRef : brandsRef
    const setOpen = which === 'categories' ? setCategoriesOpen : setBrandsOpen
    const key = which === 'categories' ? 'categories' : 'brands'

    const next = e?.relatedTarget
    if (ref.current && next && ref.current.contains(next)) return

    if (closeTimers.current[key]) clearTimeout(closeTimers.current[key])
    closeTimers.current[key] = setTimeout(() => {
      setOpen(false)
    }, 180)
  }

  return (
    <>
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 py-2.5 sm:py-2">
          <div className="flex items-center gap-3 sm:gap-4 min-h-[44px] items-center">
            <a
              href={`tel:${siteData.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 hover:text-primary-light py-1.5 -my-1.5 px-1 -mx-1 rounded active:bg-white/10"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden />
              <span className="truncate max-w-[140px] xs:max-w-none">{siteData.phone}</span>
            </a>
            <a
              href={`mailto:${siteData.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-primary-light py-1 -my-1 px-1 -mx-1 rounded active:bg-white/10"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden />
              <span>{siteData.email}</span>
            </a>
          </div>
          <Link
            to="/contact"
            className="font-semibold text-primary-light hover:underline py-2.5 px-2 -my-1 rounded active:bg-white/10 min-h-[44px] inline-flex items-center"
          >
            INQUIRE NOW
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between min-h-[56px] md:h-20 gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-3 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link
              to="/"
              className="flex items-center justify-center md:justify-start md:flex-initial min-h-[44px] gap-2.5 shrink-0"
              aria-label={siteData.name}
            >
              <img
                src="/BT_Logo2.png"
                alt=""
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-md"
              />
              <span className="hidden lg:inline-flex flex-col leading-tight text-lg font-extrabold tracking-tight">
                <span className="text-[#1E3A8A]">Burhani</span>
                <span className="text-[#D4AF37]">Traders</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 lg:gap-6 flex-1 justify-center" aria-label="Main navigation">
              <Link to="/" className="text-gray-700 hover:text-primary font-semibold whitespace-nowrap">
                Home
              </Link>
              <div
                className="relative"
                ref={categoriesRef}
                onMouseEnter={() => openDropdown('categories')}
                onMouseLeave={(e) => scheduleCloseDropdown('categories', e)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-gray-700 hover:text-primary font-semibold whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded={categoriesOpen}
                  onClick={() => setCategoriesOpen((v) => !v)}
                >
                  Categories <ChevronDown className={`w-4 h-4 transition ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesOpen && (
                  <div className="absolute left-0 mt-2 w-[44rem] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-lg p-2 z-50">
                    <Link
                      to="/products"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      All categories
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={categoryPublicPath(cat.slug)}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                ref={brandsRef}
                onMouseEnter={() => openDropdown('brands')}
                onMouseLeave={(e) => scheduleCloseDropdown('brands', e)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-gray-700 hover:text-primary font-semibold whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded={brandsOpen}
                  onClick={() => setBrandsOpen((v) => !v)}
                >
                  Brands <ChevronDown className={`w-4 h-4 transition ${brandsOpen ? 'rotate-180' : ''}`} />
                </button>
                {brandsOpen && (
                  <div className="absolute left-0 mt-2 w-[44rem] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-lg p-2 z-50">
                    <Link
                      to="/brands"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setBrandsOpen(false)}
                    >
                      All brands
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                      {brandList.map((b) => (
                        <Link
                          key={b.slug}
                          to={`/products?brand=${encodeURIComponent(b.slug)}`}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                          onClick={() => setBrandsOpen(false)}
                        >
                          {b.name}
                        </Link>
                      ))}
                      {brandList.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No brands yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="text-gray-700 hover:text-primary font-semibold whitespace-nowrap">
                About us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary font-semibold whitespace-nowrap">
                Contact Us
              </Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <form
                onSubmit={handleSearch}
                className={`flex ${searchOpen ? 'absolute left-4 right-4 top-20 md:relative md:top-0 md:left-0' : ''}`}
              >
                <input
                  type="search"
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`border border-gray-300 rounded-lg px-3 py-2 text-sm w-0 md:w-44 lg:w-52 focus:w-44 md:focus:w-44 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${searchOpen ? 'w-full' : ''}`}
                  aria-label="Search for products"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Toggle search"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button type="submit" className="hidden md:flex ml-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
              </form>

              {!loading && user && (isStaff || isPending) && (
                <div className="relative hidden sm:block" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((o) => !o)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                    title={user.displayName || user.email || 'Account'}
                  >
                    <UserAvatar user={user} className="w-9 h-9 text-sm" />
                    <ChevronDown className={`w-4 h-4 shrink-0 text-gray-500 transition ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-50">
                      <p className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">{user.email}</p>
                      {profile?.role && (
                        <p className="px-3 py-1 text-[10px] uppercase font-semibold text-primary">{profile.role}</p>
                      )}
                      {isStaff && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin portal
                        </Link>
                      )}
                      {isPending && (
                        <Link
                          to="/admin/pending"
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Pending access
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!loading && (!user || (!isStaff && !isPending)) && (
                <Link to="/admin/login" className="hidden sm:inline-flex text-sm text-gray-700 hover:text-primary font-medium px-2">
                  Login
                </Link>
              )}

              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-1 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-8rem)] overflow-y-auto"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="px-4 py-4 space-y-0">
              {user && (
                <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                  <UserAvatar user={user} className="w-10 h-10" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.displayName || 'Signed in'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              <Link
                to="/"
                className="block py-3.5 font-medium text-gray-700 hover:text-primary active:bg-gray-50 border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <div className="pt-3 pb-2 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-0.5">Categories</div>
                <div className="grid grid-cols-1 gap-0.5 max-h-48 overflow-y-auto">
                  {categories.slice(0, 12).map((cat) => (
                    <Link
                      key={cat.id}
                      to={categoryPublicPath(cat.slug)}
                      className="py-3 text-sm text-gray-600 hover:text-primary active:bg-gray-50 rounded px-2 -mx-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link to="/products" className="inline-block mt-2 text-sm font-medium text-primary py-2" onClick={() => setMenuOpen(false)}>
                  All products
                </Link>
              </div>
              <Link
                to="/brands"
                className="block py-3.5 font-medium text-gray-700 hover:text-primary active:bg-gray-50 border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Brands
              </Link>
              <Link
                to="/about"
                className="block py-3.5 font-medium text-gray-700 hover:text-primary active:bg-gray-50 border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                About us
              </Link>
              <Link
                to="/contact"
                className="block py-3.5 font-medium text-gray-700 hover:text-primary active:bg-gray-50 border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Link>
              {isStaff && (
                <Link
                  to="/admin"
                  className="block py-3.5 font-medium text-primary border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin portal
                </Link>
              )}
              {isPending && (
                <Link
                  to="/admin/pending"
                  className="block py-3.5 font-medium text-amber-700 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Access pending
                </Link>
              )}
              {!user && (
                <Link
                  to="/admin/login"
                  className="block py-3.5 font-medium text-primary border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Staff login
                </Link>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    signOut()
                  }}
                  className="block w-full text-left py-3.5 font-medium text-gray-700 border-b border-gray-100"
                >
                  Sign out
                </button>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full bg-primary text-white py-4 rounded-lg font-medium mt-4 min-h-[48px] active:bg-primary-dark"
                onClick={() => setMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
