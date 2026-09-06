import { Menu, UserRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from './navigation'
import { ServiceStatusIndicator, useServiceStatus } from './ServiceStatus'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  onOpenMenu: () => void
  isMenuOpen: boolean
}

export default function Header({ onOpenMenu, isMenuOpen }: HeaderProps) {
  const { pathname } = useLocation()
  const { username } = useAuth()
  const status = useServiceStatus()

  const current = NAV_ITEMS.find((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)))

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-3 px-3 md:h-16 md:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">
            {current?.label ?? 'PRAVAH'}
          </h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">{current?.hint}</p>
        </div>

        <div className="hidden sm:block">
          <ServiceStatusIndicator status={status} />
        </div>

        {username && (
          <div className="flex items-center gap-2 border-slate-200 pl-3 sm:border-l">
            <UserRound className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="hidden max-w-[10rem] truncate text-sm text-slate-700 sm:inline">{username}</span>
          </div>
        )}
      </div>

      {/* On the narrowest screens the status moves to its own row rather than crowding the title. */}
      <div className="border-t border-slate-100 px-3 py-1.5 sm:hidden">
        <ServiceStatusIndicator status={status} />
      </div>
    </header>
  )
}
