import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutGrid,
  FolderTree,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Package,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function AdminLayout() {
  const { profile, user, signOut, isAdmin } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const closeMobile = () => setMobileNavOpen(false)

  const NavItems = () => (
    <>
      <NavLink to="/admin/products" className={navLinkClass} onClick={closeMobile}>
        <Package className="w-5 h-5 shrink-0" aria-hidden />
        Products
      </NavLink>
      <NavLink to="/admin/categories" className={navLinkClass} onClick={closeMobile}>
        <FolderTree className="w-5 h-5 shrink-0" aria-hidden />
        Categories
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin/users" className={navLinkClass} onClick={closeMobile}>
          <Users className="w-5 h-5 shrink-0" aria-hidden />
          Approvals
        </NavLink>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900 truncate">Admin</span>
        </div>
        <Link
          to="/"
          className="text-sm text-primary font-medium flex items-center gap-1 shrink-0"
        >
          Site <ExternalLink className="w-4 h-4" />
        </Link>
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(18rem,88vw)] bg-white shadow-xl flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900">Menu</span>
              <button type="button" onClick={closeMobile} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <NavItems />
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-col border-r border-gray-200 bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link to="/admin/products" className="font-bold text-gray-900 text-lg">
            Burhani Admin
          </Link>
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            View storefront <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          <NavItems />
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <LayoutGrid className="w-4 h-4" aria-hidden />
            <span>Portal</span>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            {user && (
              <div className="flex items-center gap-2 min-w-0 text-right">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-9 h-9 rounded-full border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                    {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[12rem] lg:max-w-xs">
                    {user.displayName || 'Staff'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[12rem] lg:max-w-xs">{user.email}</p>
                  {profile?.role && (
                    <p className="text-[10px] uppercase tracking-wide text-primary font-semibold">{profile.role}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
