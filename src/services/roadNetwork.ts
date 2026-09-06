import { getRoadGeometry } from './pravah'
import { buildRoadNetwork, type RoadNetwork } from '../utils/geo'

/**
 * The road layer is a little over a megabyte and every map screen needs it, so
 * it is fetched once per session and shared. Concurrent callers await the same
 * request instead of starting their own.
 */
let cache: RoadNetwork | null = null
let inFlight: Promise<RoadNetwork> | null = null

/** Keeps the payload manageable while staying accurate at street zoom levels. */
const SIMPLIFY_TOLERANCE = 0.0005

export function loadRoadNetwork(): Promise<RoadNetwork> {
  if (cache) return Promise.resolve(cache)
  if (inFlight) return inFlight

  inFlight = getRoadGeometry({ simplify: SIMPLIFY_TOLERANCE, limit: 20_000 })
    .then((collection) => {
      cache = buildRoadNetwork(collection)
      return cache
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

/** Drops the cached network so the next screen reloads it. */
export function clearRoadNetwork(): void {
  cache = null
}
