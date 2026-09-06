/**
 * Place search for the Safe Routes form.
 *
 * The backend has no address search of its own (only a handful of hardcoded
 * place names in `geocode_place_name`, meant for shipment creation by name).
 * Typing a location here instead searches two sources, combined:
 *
 *  1. Named roads already loaded on the map - instant, works offline, and is
 *     the most relevant match for a routing journey.
 *  2. OpenStreetMap's public Nominatim search - covers towns, landmarks and
 *     addresses the road layer doesn't name. It is rate-limited (fair use,
 *     no key required) and CORS-enabled for browser use; results are biased
 *     to the loaded region with `viewbox`/`bounded` so a plain place name
 *     resolves to somewhere on the map rather than anywhere in the world.
 *
 * A failure of (2) - offline, blocked, rate-limited - degrades quietly to (1)
 * rather than surfacing a network error; tapping the map always still works.
 */
import type { RoadNetwork } from '../utils/geo'
import { midpointOf } from '../utils/geo'

export interface PlaceSuggestion {
  id: string
  /** Shown as the suggestion's main line, and filled into the field on selection. */
  label: string
  /** Shown as a smaller second line, when there is one. */
  sublabel?: string
  lat: number
  lon: number
}

export interface PlaceSearchResult {
  suggestions: PlaceSuggestion[]
  /** True when the remote search failed and only local road names were searched. */
  remoteFailed: boolean
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const LOCAL_LIMIT = 4
const REMOTE_LIMIT = 5
const REMOTE_TIMEOUT_MS = 4000

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

function localRoadMatches(query: string, network: RoadNetwork): PlaceSuggestion[] {
  const needle = query.toLowerCase()
  const seenNames = new Set<string>()
  const matches: PlaceSuggestion[] = []

  for (const feature of network.features) {
    const name = feature.properties.name
    if (!name) continue
    const key = name.toLowerCase()
    if (!key.includes(needle) || seenNames.has(key)) continue

    const point = midpointOf(feature.geometry.coordinates)
    if (!point) continue

    seenNames.add(key)
    matches.push({
      id: `road-${feature.properties.id}`,
      label: name,
      sublabel: 'Road',
      lat: point[0],
      lon: point[1],
    })
    if (matches.length >= LOCAL_LIMIT) break
  }

  return matches
}

async function remotePlaceMatches(
  query: string,
  network: RoadNetwork,
  signal: AbortSignal,
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    limit: String(REMOTE_LIMIT),
    addressdetails: '0',
  })

  if (network.extent) {
    const { minLat, minLon, maxLat, maxLon } = network.extent
    // Nominatim's viewbox order is left,top,right,bottom = minLon,maxLat,maxLon,minLat.
    params.set('viewbox', `${minLon},${maxLat},${maxLon},${minLat}`)
    params.set('bounded', '1')
  }

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Nominatim responded with ${response.status}`)

  const data = (await response.json()) as NominatimResult[]
  return data
    .map((item): PlaceSuggestion | null => {
      const lat = Number(item.lat)
      const lon = Number(item.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      const parts = item.display_name.split(',').map((part) => part.trim())
      const sublabel = parts.slice(1, 3).join(', ')
      return {
        id: `place-${item.place_id}`,
        label: parts[0] ?? item.display_name,
        ...(sublabel ? { sublabel } : {}),
        lat,
        lon,
      }
    })
    .filter((item): item is PlaceSuggestion => item !== null)
}

/** Searches both sources and merges the results, local matches first. */
export async function searchPlaces(query: string, network: RoadNetwork): Promise<PlaceSearchResult> {
  const local = localRoadMatches(query, network)

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS)

  try {
    const remote = await remotePlaceMatches(query, network, controller.signal)
    const seenLabels = new Set<string>()
    const suggestions = [...local, ...remote].filter((item) => {
      const key = item.label.toLowerCase()
      if (seenLabels.has(key)) return false
      seenLabels.add(key)
      return true
    })
    return { suggestions, remoteFailed: false }
  } catch {
    return { suggestions: local, remoteFailed: true }
  } finally {
    window.clearTimeout(timeoutId)
  }
}
