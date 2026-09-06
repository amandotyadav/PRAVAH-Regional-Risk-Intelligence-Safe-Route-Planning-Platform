import {
  AlertTriangle,
  FilePlus2,
  LayoutDashboard,
  Map,
  Route,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Shown under the label in the mobile drawer. */
  hint: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, hint: 'Overview of current conditions' },
  { to: '/risk-map', label: 'Risk Map', icon: Map, hint: 'Road conditions across the region' },
  { to: '/routes', label: 'Safe Routes', icon: Route, hint: 'Plan a journey around risky roads' },
  { to: '/incidents', label: 'Incidents', icon: AlertTriangle, hint: 'Reports from the field' },
  { to: '/reports', label: 'Reports', icon: FilePlus2, hint: 'Report a road problem' },
  { to: '/settings', label: 'Settings', icon: Settings, hint: 'Service status and preferences' },
]
