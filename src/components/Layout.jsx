import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import WhatsAppFab from './WhatsAppFab'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  const { pathname } = useLocation()
  const showBottomPad = !pathname.startsWith('/admin')

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded">
        Skip to main content
      </a>
      <Header />
      <main id="main" className={showBottomPad ? 'pb-[4.25rem] md:pb-0' : undefined}>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppFab />
      <ScrollToTop />
    </>
  )
}
