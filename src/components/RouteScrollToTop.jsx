import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets window scroll on client-side navigation (SPA). Without this, the new
 * page keeps the previous scroll position.
 */
export default function RouteScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}
