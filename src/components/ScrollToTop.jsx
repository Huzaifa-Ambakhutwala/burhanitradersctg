import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed z-50 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 active:bg-gray-600 focus:ring-4 focus:ring-gray-600 transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))', right: 'max(1rem, env(safe-area-inset-right))' }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
