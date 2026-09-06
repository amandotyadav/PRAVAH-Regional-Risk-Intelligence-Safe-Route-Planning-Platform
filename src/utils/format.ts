import type { IncidentSeverity, IncidentType, RoadType } from '../types'

/** Plain-language names for the backend's incident types. */
export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  blocked: 'Road blocked',
  landslide: 'Landslide',
  flood: 'Flooding',
  bridge_damage: 'Bridge damage',
  other: 'Other',
}

/** Plain-language names for the backend's severity levels. */
export const INCIDENT_SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

/** Severity uses the same semantic colours as risk state. */
export const INCIDENT_SEVERITY_STYLES: Record<IncidentSeverity, string> = {
  low: 'bg-green-50 text-green-800 border-green-300',
  medium: 'bg-amber-50 text-amber-800 border-amber-300',
  high: 'bg-orange-50 text-orange-800 border-orange-300',
  critical: 'bg-red-50 text-red-800 border-red-300',
}

export const ROAD_TYPE_LABELS: Partial<Record<RoadType, string>> = {
  motorway: 'Expressway',
  trunk: 'National highway',
  primary: 'Major road',
  secondary: 'State road',
  tertiary: 'District road',
  residential: 'Residential street',
  unclassified: 'Minor road',
  motorway_link: 'Expressway link',
  trunk_link: 'Highway link',
  primary_link: 'Major road link',
  secondary_link: 'State road link',
  tertiary_link: 'District road link',
  living_street: 'Living street',
  service: 'Service road',
  track: 'Track',
  road: 'Road',
  unknown: 'Unclassified road',
}

export function roadTypeLabel(type: RoadType | string): string {
  return ROAD_TYPE_LABELS[type as RoadType] ?? 'Road'
}

/** "Road segment 65" or its name when OSM provides one. */
export function roadDisplayName(name: string | null | undefined, segmentId: number): string {
  const trimmed = name?.trim()
  return trimmed ? trimmed : `Road segment ${segmentId}`
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes))
  if (total < 1) return 'Under a minute'
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  const rest = total % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}

/** Absolute local time, e.g. "6 Sep 2026, 01:24". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "12 minutes ago" - paired with the absolute time, never replacing it. */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function formatCoordinate(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}
