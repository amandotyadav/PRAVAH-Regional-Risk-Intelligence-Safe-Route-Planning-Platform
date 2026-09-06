/**
 * One function per backend endpoint. UI components call these; they never
 * build URLs or touch Axios directly.
 */
import { api } from './api'
import type {
  AccessToken,
  Alert,
  HealthStatus,
  Incident,
  IncidentCreate,
  RiskAssessment,
  RoadFeatureCollection,
  RoadSegment,
  RouteRecommendation,
  Shipment,
  ShipmentCreate,
} from '../types'

const V1 = '/api/v1'

/* ---------------------------------------------------------------- health */

/** GET /health/live - public, no token required. */
export async function getLiveness(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health/live', { timeout: 8_000 })
  return data
}

/** GET /health/ready - public, reports database connectivity. */
export async function getReadiness(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health/ready', { timeout: 8_000 })
  return data
}

/* ------------------------------------------------------------------ auth */

/** POST /api/v1/auth/login - OAuth2 password form, not JSON. */
export async function login(username: string, password: string): Promise<AccessToken> {
  const form = new URLSearchParams()
  form.set('username', username)
  form.set('password', password)
  const { data } = await api.post<AccessToken>(`${V1}/auth/login`, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

/* ----------------------------------------------------------------- roads */

/** GET /api/v1/roads/ - road segment attributes without geometry. */
export async function getRoads(skip = 0, limit = 100): Promise<RoadSegment[]> {
  const { data } = await api.get<RoadSegment[]>(`${V1}/roads/`, { params: { skip, limit } })
  return data
}

/** GET /api/v1/roads/risk - current risk assessment for every road segment. */
export async function getRoadRisks(): Promise<RiskAssessment[]> {
  const { data } = await api.get<RiskAssessment[]>(`${V1}/roads/risk`)
  return data
}

export interface RoadGeometryQuery {
  /** Specific segment IDs; when given the other filters are ignored. */
  ids?: number[]
  /** [minLon, minLat, maxLon, maxLat] */
  bbox?: [number, number, number, number]
  roadTypes?: string[]
  /** Simplify tolerance in degrees. 0.0005 keeps roads accurate at city zoom. */
  simplify?: number
  limit?: number
}

/** GET /api/v1/roads/geojson - road geometry as a GeoJSON FeatureCollection. */
export async function getRoadGeometry(query: RoadGeometryQuery = {}): Promise<RoadFeatureCollection> {
  const params: Record<string, string | number> = {}
  if (query.ids?.length) params.ids = query.ids.join(',')
  if (query.bbox) params.bbox = query.bbox.join(',')
  if (query.roadTypes?.length) params.road_types = query.roadTypes.join(',')
  if (query.simplify !== undefined) params.simplify = query.simplify
  if (query.limit !== undefined) params.limit = query.limit

  const { data } = await api.get<RoadFeatureCollection>(`${V1}/roads/geojson`, { params })
  return data
}

/* ------------------------------------------------------------- incidents */

export interface IncidentQuery {
  road_segment_id?: number
  verified?: boolean
}

/** GET /api/v1/incidents/ */
export async function getIncidents(query: IncidentQuery = {}): Promise<Incident[]> {
  const { data } = await api.get<Incident[]>(`${V1}/incidents/`, { params: query })
  return data
}

/** GET /api/v1/incidents/{id} */
export async function getIncident(id: number): Promise<Incident> {
  const { data } = await api.get<Incident>(`${V1}/incidents/${id}`)
  return data
}

/** POST /api/v1/incidents/ */
export async function createIncident(payload: IncidentCreate): Promise<Incident> {
  const { data } = await api.post<Incident>(`${V1}/incidents/`, payload)
  return data
}

/**
 * DELETE /api/v1/incidents/{id} - a hard delete, with no ownership check on the
 * backend. Only offer this for a report the current person just filed in this
 * session (e.g. to undo a mistake), never as a general action on someone else's
 * report browsed from the incidents list.
 */
export async function deleteIncident(id: number): Promise<void> {
  await api.delete(`${V1}/incidents/${id}`)
}

/* ------------------------------------------------------------- shipments */

/** POST /api/v1/shipments/ */
export async function createShipment(payload: ShipmentCreate): Promise<Shipment> {
  const { data } = await api.post<Shipment>(`${V1}/shipments/`, payload)
  return data
}

/** GET /api/v1/shipments/{id} */
export async function getShipment(id: number): Promise<Shipment> {
  const { data } = await api.get<Shipment>(`${V1}/shipments/${id}`)
  return data
}

/** POST /api/v1/shipments/{id}/reroute */
export async function rerouteShipment(id: number): Promise<RouteRecommendation> {
  const { data } = await api.post<RouteRecommendation>(`${V1}/shipments/${id}/reroute`)
  return data
}

/* ---------------------------------------------------------------- routes */

/** POST /api/v1/routes/recommend?shipment_id=... - shipment_id is a query parameter. */
export async function recommendRoute(shipmentId: number): Promise<RouteRecommendation> {
  const { data } = await api.post<RouteRecommendation>(`${V1}/routes/recommend`, null, {
    params: { shipment_id: shipmentId },
    timeout: 120_000,
  })
  return data
}

/* ---------------------------------------------------------------- alerts */

export interface AlertQuery {
  shipment_id?: number
  acknowledged?: boolean
}

/** GET /api/v1/alerts/ */
export async function getAlerts(query: AlertQuery = {}): Promise<Alert[]> {
  const { data } = await api.get<Alert[]>(`${V1}/alerts/`, { params: query })
  return data
}

/** POST /api/v1/alerts/{id}/acknowledge */
export async function acknowledgeAlert(id: number): Promise<Alert> {
  const { data } = await api.post<Alert>(`${V1}/alerts/${id}/acknowledge`)
  return data
}
