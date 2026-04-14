import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, MessageCircle, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import UserAvatar from './UserAvatar'

export default function BottomNav() {
  const location = useLocation()
  const { user, loading, isStaff, isPending } = useAuth()

  if (location.pathname.startsWith('/admin')) {
    return null
  }

  let accountHref = '/admin/login'
  let accountLabel = 'Login'

  if (!loading && user) {
    if (isPending) {
      accountHref = '/admin/pending'
      accountLabel = 'Pending'
    } else if (isStaff) {
      accountHref = '/admin'
      accountLabel = 'Admin'
    }
  }

  const showProfile = !loading && user && (isStaff || isPending)

  const navClass =
    'flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 text-[11px] sm:text-xs font-medium transition-colors'

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Bottom navigation"
    >
      <div className="flex max-w-lg mx-auto">
        <Link to="/" className={`${navClass} text-gray-600 hover:text-primary active:text-primary`}>
          <Home className="w-5 h-5 shrink-0" aria-hidden />
          <span>Home</span>
        </Link>
        <Link to="/products" className={`${navClass} text-gray-600 hover:text-primary active:text-primary`}>
          <LayoutGrid className="w-5 h-5 shrink-0" aria-hidden />
          <span>Products</span>
        </Link>
        <Link to="/contact" className={`${navClass} text-gray-600 hover:text-primary active:text-primary`}>
          <MessageCircle className="w-5 h-5 shrink-0" aria-hidden />
          <span>Contact</span>
        </Link>
        <Link
          to={accountHref}
          className={`${navClass} ${showProfile && isStaff ? 'text-primary' : 'text-gray-600 hover:text-primary active:text-primary'}`}
        >
          {showProfile ? (
            <UserAvatar user={user} className="w-7 h-7 text-xs" />
          ) : (
            <LogIn className="w-5 h-5 shrink-0" aria-hidden />
          )}
          <span className="truncate max-w-full">{accountLabel}</span>
        </Link>
      </div>
    </nav>
  )
}
