import {
  AlertTriangle,
  FileText,
  Gauge,
  Map,
  Navigation,
  Settings,
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
      <button aria-label="Close navigation" onClick={onClose} className={`fixed inset-0 z-[1050] bg-slate-900/35 transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed left-0 top-0 z-[1100] flex h-dvh w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:w-56 lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-sm font-black text-white">
          P
        </div>

        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">PRAVAH</h1>

          <p className="text-[11px] text-slate-500">Regional Safety & Risk Information</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-2 px-2 text-xs font-medium text-slate-500">Menu</p>

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
                  "flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition",
                  isActive
                    ? "border-blue-700 bg-blue-50 font-medium text-blue-800"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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
      <div className="space-y-3 border-t border-slate-200 p-3">
        <NavLink to="/settings" onClick={onClose} className={({ isActive }) => `flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${isActive ? "border-blue-700 bg-blue-50 font-medium text-blue-800" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Settings size={18} />Settings</NavLink>

        <div className="border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold text-slate-700">Service status</span>
          </div>

          <p className="mt-1 pl-4 text-[11px] text-slate-500">
            All services available
          </p>
        </div>

      </div>
      </aside>
    </>
  );
}

export default Sidebar;
