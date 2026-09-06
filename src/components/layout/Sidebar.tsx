import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_ITEMS } from './navigation'

interface SidebarProps {
  /** Drawer state on small screens. The sidebar is always visible on desktop. */
  isOpen: boolean
  onClose: () => void
}

function linkClasses(isActive: boolean): string {
  const base =
    'flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors md:py-2 md:items-center'
  return isActive
    ? `${base} bg-slate-100 font-medium text-slate-900`
    : `${base} text-slate-700 hover:bg-slate-50 hover:text-slate-900`
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay: tapping anywhere outside the drawer closes it. */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="main-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out md:sticky md:top-0 md:z-auto md:h-screen md:w-56 md:max-w-none md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 md:h-16">
          <div className="min-w-0">
            <p className="text-base font-semibold tracking-tight text-slate-900">PRAVAH</p>
            <p className="truncate text-xs text-slate-500">Northeast Region</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-slate-500 md:mt-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500 md:hidden">{item.hint}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-200 px-4 py-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Road risk information is indicative. Follow instructions from local authorities.
          </p>
        </div>
      </div>
    </>
  )
}
