import {
  AlertTriangle,
  FileText,
  Gauge,
  Map,
  Navigation,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: Gauge,
  },
  {
    name: "Risk Map",
    path: "/risk-map",
    icon: Map,
  },
  {
    name: "Safe Routes",
    path: "/routes",
    icon: Navigation,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: AlertTriangle,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

interface SidebarProps { open: boolean; onClose: () => void; }

function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <button aria-label="Close navigation" onClick={onClose} className={`fixed inset-0 z-[1050] bg-slate-950/70 transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed left-0 top-0 z-[1100] flex h-dvh w-72 -translate-x-full flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:w-64 lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-lg font-black text-slate-950">
          P
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide">PRAVAH</h1>

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            NER Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Command Center
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition",
                  isActive
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-4 border-t border-slate-800 p-4">
        <NavLink to="/settings" onClick={onClose} className={({ isActive }) => `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${isActive ? "bg-cyan-400/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}`}><Settings size={18} />Settings</NavLink>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold text-slate-200">
              System Online
            </span>
          </div>

          <p className="mt-1 pl-4 text-[10px] text-slate-500">
            All services operational
          </p>
        </div>

        <div className="flex items-center gap-2 px-2 text-[10px] text-slate-600">
          <ShieldCheck size={13} />
          PRAVAH v0.1
        </div>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;
