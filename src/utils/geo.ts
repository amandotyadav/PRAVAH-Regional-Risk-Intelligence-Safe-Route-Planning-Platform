import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet'
import type { Position, RoadFeature, RoadFeatureCollection } from '../types'

/**
 * GeoJSON stores positions as [longitude, latitude]; Leaflet expects
 * [latitude, longitude]. Every conversion in the app goes through here.
 */
export function toLatLng(position: Position): LatLngTuple {
  return [position[1], position[0]]
}

export function toLatLngs(positions: Position[]): LatLngTuple[] {
  return positions.map(toLatLng)
}

/** Point roughly halfway along a line, used to place a marker on a road. */
export function midpointOf(positions: Position[]): LatLngTuple | null {
  if (positions.length === 0) return null
  return toLatLng(positions[Math.floor(positions.length / 2)])
}

/** Bounds covering every given path, or null when there is nothing to show. */
export function boundsOfPaths(paths: LatLngTuple[][]): LatLngBoundsExpression | null {
  let minLat = Infinity
  let minLng = Infinity
  let maxLat = -Infinity
  let maxLng = -Infinity

  for (const path of paths) {
    for (const [lat, lng] of path) {
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
    }
  }

  if (minLat === Infinity) return null
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ]
}

/** Squared degree distance - fine for comparing candidates over a small region. */
function squaredDistance(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = aLat - bLat
  const dLon = (aLon - bLon) * Math.cos((aLat * Math.PI) / 180)
  return dLat * dLat + dLon * dLon
}

/** Great-circle distance in metres. */
export function distanceMetres(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6_371_000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLon = toRad(bLon - aLon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/* ------------------------------------------------------- road network ---- */

export interface RoadNode {
  id: number
  lat: number
  lon: number
}

/**
 * A lookup built once from the GeoJSON road layer.
 *
 * `routableNodes` holds the nodes of the largest connected part of the road
 * network. The backend snaps a requested point to the geometrically nearest
 * node, which can sit in a small isolated cluster of roads that nothing else
 * connects to; sending a node from the largest connected part instead is what
 * makes route requests succeed.
 */
export interface RoadNetwork {
  features: RoadFeature[]
  featureById: Map<number, RoadFeature>
  nodes: Map<number, RoadNode>
  routableNodes: RoadNode[]
  /** Extent of every loaded road, so a map can open showing all of them. */
  bounds: LatLngBoundsExpression | null
}

function endpointsOf(feature: RoadFeature): { from: Position; to: Position } | null {
  const coords = feature.geometry?.coordinates
  if (!coords || coords.length < 2) return null
  return { from: coords[0], to: coords[coords.length - 1] }
}

export function buildRoadNetwork(collection: RoadFeatureCollection): RoadNetwork {
  const features = collection.features.filter((f) => (f.geometry?.coordinates?.length ?? 0) >= 2)
  const featureById = new Map<number, RoadFeature>()
  const nodes = new Map<number, RoadNode>()
  const adjacency = new Map<number, number[]>()

  const link = (a: number, b: number) => {
    const existing = adjacency.get(a)
    if (existing) existing.push(b)
    else adjacency.set(a, [b])
  }

  for (const feature of features) {
    featureById.set(feature.properties.id, feature)
    const ends = endpointsOf(feature)
    if (!ends) continue

    const { from_node: fromNode, to_node: toNode } = feature.properties
    if (!nodes.has(fromNode)) nodes.set(fromNode, { id: fromNode, lat: ends.from[1], lon: ends.from[0] })
    if (!nodes.has(toNode)) nodes.set(toNode, { id: toNode, lat: ends.to[1], lon: ends.to[0] })

    link(fromNode, toNode)
    link(toNode, fromNode)
  }

  return {
    features,
    featureById,
    nodes,
    routableNodes: largestComponent(adjacency, nodes),
    bounds: boundsOfPaths(features.map((feature) => toLatLngs(feature.geometry.coordinates))),
  }
}

/** Breadth-first sweep that returns the nodes of the biggest connected part. */
function largestComponent(adjacency: Map<number, number[]>, nodes: Map<number, RoadNode>): RoadNode[] {
  const seen = new Set<number>()
  let best: number[] = []

  for (const start of adjacency.keys()) {
    if (seen.has(start)) continue

    const component: number[] = []
    const queue: number[] = [start]
    seen.add(start)

    while (queue.length > 0) {
      const current = queue.pop() as number
      component.push(current)
      for (const neighbour of adjacency.get(current) ?? []) {
        if (!seen.has(neighbour)) {
          seen.add(neighbour)
          queue.push(neighbour)
        }
      }
    }

    if (component.length > best.length) best = component
  }

  return best
    .map((id) => nodes.get(id))
    .filter((node): node is RoadNode => node !== undefined)
}

/** Nearest node on the connected road network to an arbitrary map point. */
export function nearestRoutableNode(network: RoadNetwork, lat: number, lon: number): RoadNode | null {
  let best: RoadNode | null = null
  let bestDistance = Infinity

  for (const node of network.routableNodes) {
    const distance = squaredDistance(lat, lon, node.lat, node.lon)
    if (distance < bestDistance) {
      bestDistance = distance
      best = node
    }
  }

  return best
}

/** Nearest road segment to a map point, measured against every shape point. */
export function nearestFeature(features: RoadFeature[], lat: number, lon: number): RoadFeature | null {
  let best: RoadFeature | null = null
  let bestDistance = Infinity

  for (const feature of features) {
    for (const [featureLon, featureLat] of feature.geometry.coordinates) {
      const distance = squaredDistance(lat, lon, featureLat, featureLon)
      if (distance < bestDistance) {
        bestDistance = distance
        best = feature
      }
    }
  }

  return best
}

/* --------------------------------------------------------- route shapes -- */

/**
 * Join the recommended route's segments into drawable paths.
 *
 * The backend returns `path_nodes` and `path_segments` in travel order, so each
 * segment's stored geometry is flipped when needed to continue from the previous
 * one. If a segment's geometry is missing the path is broken in two rather than
 * bridged, so the map never shows a straight line that is not a real road.
 */
export function buildRoutePaths(
  pathNodes: number[],
  pathSegments: number[],
  featureById: Map<number, RoadFeature>,
): LatLngTuple[][] {
  const paths: LatLngTuple[][] = []
  let current: LatLngTuple[] = []

  for (let index = 0; index < pathSegments.length; index += 1) {
    const feature = featureById.get(pathSegments[index])

    if (!feature) {
      if (current.length > 1) paths.push(current)
      current = []
      continue
    }

    const coordinates = feature.geometry.coordinates
    const entryNode = pathNodes[index]
    // Travel order decides which end of the stored line comes first.
    const forward = feature.properties.from_node === entryNode
    const ordered = forward ? coordinates : [...coordinates].reverse()
    const asLatLng = toLatLngs(ordered)

    if (current.length === 0) {
      current = asLatLng
    } else {
      // Drop the shared node so it is not repeated at the join.
      current.push(...asLatLng.slice(1))
    }
  }

  if (current.length > 1) paths.push(current)
  return paths
}
