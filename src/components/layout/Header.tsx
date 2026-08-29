import { Bell, ChevronDown, CircleCheck, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = { "/": "Regional Risk Overview", "/risk-map": "Risk Map", "/routes": "Safe Routes", "/incidents": "Incidents", "/reports": "Report an Incident", "/settings": "Settings" };
function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "PRAVAH";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[1000] flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3"><button aria-label="Open menu" onClick={onMenuOpen} className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-700 lg:hidden"><Menu size={21} /></button><div className="min-w-0"><p className="hidden text-xs text-slate-500 sm:block">Dashboard</p>

        <h2 className="truncate text-base font-semibold text-slate-900 sm:mt-0.5 sm:text-lg">{title}</h2></div></div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* System status */}
        <div className="hidden items-center gap-2 md:flex">
          <CircleCheck size={15} className="text-emerald-600" />

          <span className="text-xs text-slate-600">Services available</span>
        </div>

        {/* Notifications */}
        <div className="relative"><button aria-label="View notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }} className="relative flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          <Bell size={17} />

          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-600" />
        </button>{notificationsOpen && <div className="absolute right-0 top-12 w-72 border border-slate-200 bg-white p-3 shadow-lg"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Notifications</p><button onClick={() => setNotificationsOpen(false)} className="text-xs font-medium text-blue-700">Mark all read</button></div><p className="mt-3 border-l-2 border-red-600 bg-red-50 p-3 text-xs leading-5 text-slate-700">A critical landslide report awaits verification near Siliguri.</p></div>}</div>

        {/* Profile */}
        <div className="relative"><button aria-label="Open administrator menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-800">User</p>

            <p className="text-[11px] text-slate-500">Staff</p>
          </div>

          <ChevronDown size={14} className="text-slate-400" />
        </button>{profileOpen && <div className="absolute right-0 top-12 w-52 border border-slate-200 bg-white p-2 shadow-lg"><p className="px-3 py-2 text-xs text-slate-500">User</p><Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><Settings size={15} />Settings</Link></div>}</div>
      </div>
    </header>
  );
}

export default Header;
