import { Bell, ChevronDown, CircleCheck, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = { "/": "Risk Monitoring Dashboard", "/risk-map": "Regional Risk Map", "/routes": "Safe Route Planning", "/incidents": "Incident Management", "/reports": "Report Incident", "/settings": "System Settings" };
function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Command Center";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[1000] flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3"><button aria-label="Open navigation" onClick={onMenuOpen} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-300 lg:hidden"><Menu size={20} /></button><div className="min-w-0"><p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 sm:block">Command Center / Overview</p>

        <h2 className="truncate text-base font-semibold text-slate-100 sm:mt-1 sm:text-lg">{title}</h2></div></div>

      <div className="flex items-center gap-5">
        {/* System status */}
        <div className="hidden items-center gap-2 md:flex">
          <CircleCheck size={15} className="text-emerald-400" />

          <span className="text-xs text-slate-400">System operational</span>
        </div>

        {/* Notifications */}
        <div className="relative"><button aria-label="View notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }} className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white">
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>{notificationsOpen && <div className="absolute right-0 top-11 w-72 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-100">Notifications</p><button onClick={() => setNotificationsOpen(false)} className="text-xs text-cyan-400">Mark all read</button></div><p className="mt-3 rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300">1 critical landslide report awaits verification near Siliguri.</p></div>}</div>

        {/* Profile */}
        <div className="relative"><button aria-label="Open administrator menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-cyan-400">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-200">
              Administrator
            </p>

            <p className="text-[10px] text-slate-500">Emergency Operations</p>
          </div>

          <ChevronDown size={14} className="text-slate-600" />
        </button>{profileOpen && <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"><p className="px-3 py-2 text-xs text-slate-400">Administrator</p><Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"><Settings size={15} />Settings</Link></div>}</div>
      </div>
    </header>
  );
}

export default Header;
