import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the drawer on navigation and restore the page to the top.
  useEffect(() => {
    setIsMenuOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  // Escape closes the drawer, and the page behind it must not scroll while open.
  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  return (
    <div className="flex min-h-screen bg-slate-100">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />
        <main id="main-content" className="flex-1 px-3 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
