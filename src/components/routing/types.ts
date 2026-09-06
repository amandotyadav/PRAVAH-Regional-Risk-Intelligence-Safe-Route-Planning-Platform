/** A point chosen for a journey, already snapped to a routable road node. */
export interface RoutePoint {
  lat: number
  lon: number
  /** Road network node the backend will route from or to. */
  nodeId: number
  /** Straight-line distance in metres between the tap and the snapped node. */
  snappedMetres: number
}
