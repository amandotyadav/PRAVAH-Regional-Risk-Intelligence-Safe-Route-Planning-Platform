/**
 * Types mirroring the PRAVAH backend (FastAPI) contracts.
 *
 * Sources of truth in `pravah-backend/backend`:
 *   app/core/enums.py          - every enum below
 *   app/schemas/*.py           - request/response models
 *   app/services/risk/*.py     - RiskAssessment dataclass returned by /roads/risk
 *   app/api/v1/roads.py        - /roads/geojson FeatureCollection
 */

/* ------------------------------------------------------------------ enums */

/** app/core/enums.py :: RiskState. Note the backend says MODERATE, not MEDIUM. */
export type RiskState = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN'

/** app/core/enums.py :: RoadType */
export type RoadType =
  | 'motorway' | 'trunk' | 'primary' | 'secondary' | 'tertiary'
  | 'residential' | 'unclassified'
  | 'motorway_link' | 'trunk_link' | 'primary_link' | 'secondary_link' | 'tertiary_link'
  | 'living_street' | 'service' | 'track' | 'road' | 'unknown'

/** app/core/enums.py :: IncidentType */
export type IncidentType = 'blocked' | 'landslide' | 'flood' | 'bridge_damage' | 'other'

/** app/core/enums.py :: IncidentSeverity */
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

/** app/core/enums.py :: CargoType */
export type CargoType = 'medicine' | 'food' | 'emergency' | 'commercial'

/** app/core/enums.py :: ShipmentPriority */
export type ShipmentPriority = 'critical' | 'high' | 'normal'

/** app/core/enums.py :: ShipmentStatus */
export type ShipmentStatus =
  | 'pending' | 'route_generated' | 'in_transit'
  | 'needs_reroute' | 'completed' | 'cancelled'

/* ------------------------------------------------------------------ auth */

/** POST /api/v1/auth/login (form-encoded) */
export interface AccessToken {
  access_token: string
  token_type: string
}

/** app/schemas/user.py :: User */
export interface User {
  id: number
  username: string
  email: string
  role: string
  is_active: boolean
}

/** Claims the backend puts in the JWT (app/core/security.py :: create_access_token). */
export interface TokenClaims {
  sub: string
  role?: string
  exp?: number
}

/* ------------------------------------------------------------------ roads */

/** app/schemas/road.py :: RoadSegment. Geometry is not part of this schema. */
export interface RoadSegment {
  id: number
  osm_id: string
  name: string | null
  road_type: RoadType
  length_m: number
  slope: number
  elevation: number
  from_node: number
  to_node: number
}

/* ------------------------------------------------------------------ risk */

/** Output of app/integrations/ml/mock_predictor.py :: MockPredictor.predict */
export interface RiskPrediction {
  road_segment_id: number
  blockage_probability: number
  flood_probability: number
  landslide_probability: number
  confidence: number
  prediction_horizon_hours: number
  model_version: string
  predicted_at: string
}

/** The incident shape the risk engine echoes back inside `inputs_summary`. */
export interface RiskIncidentInput {
  type: IncidentType | string
  severity: IncidentSeverity | string
  source: string
  verified: boolean
}

/**
 * app/services/risk/risk_engine.py :: assess_risk builds exactly one of these
 * four shapes, so treat it as a union rather than a bag of optional fields.
 */
export type RiskInputsSummary =
  | { prediction: RiskPrediction }
  | { incident: RiskIncidentInput }
  | { unverified_incident: RiskIncidentInput }
  | { no_data: true }

/** GET /api/v1/roads/risk returns a list of these. */
export interface RiskAssessment {
  road_segment_id: number
  state: RiskState
  /** 0.0 (safe) to 1.0 (most dangerous) */
  score: number
  /** 0.0 (no confidence) to 1.0 (full confidence) */
  confidence: number
  inputs_summary: RiskInputsSummary
}

/* -------------------------------------------------------------- geometry */

/** Properties carried by every feature of GET /api/v1/roads/geojson */
export interface RoadFeatureProperties {
  id: number
  osm_id: string
  name: string | null
  road_type: RoadType
  length_m: number
  from_node: number
  to_node: number
}

/** GeoJSON position, always [longitude, latitude]. */
export type Position = [number, number]

export interface RoadFeature {
  type: 'Feature'
  id: number
  geometry: { type: 'LineString'; coordinates: Position[] }
  properties: RoadFeatureProperties
}

export interface RoadFeatureCollection {
  type: 'FeatureCollection'
  features: RoadFeature[]
}

/* ------------------------------------------------------------- incidents */

/** app/schemas/incident.py :: Incident */
export interface Incident {
  id: number
  road_segment_id: number
  type: IncidentType
  severity: IncidentSeverity
  source: string
  description: string | null
  verified: boolean
  reported_at: string
}

/** app/schemas/incident.py :: IncidentCreate */
export interface IncidentCreate {
  road_segment_id: number
  type: IncidentType
  severity: IncidentSeverity
  source: string
  description?: string | null
  verified?: boolean
}

/* ------------------------------------------------------------- shipments */

/** app/schemas/shipment.py :: ShipmentCreate */
export interface ShipmentCreate {
  origin_name?: string | null
  destination_name?: string | null
  origin_lat?: number | null
  origin_lon?: number | null
  destination_lat?: number | null
  destination_lon?: number | null
  origin_node?: number | null
  destination_node?: number | null
  cargo_type: CargoType
  priority: ShipmentPriority
}

/** app/schemas/shipment.py :: Shipment */
export interface Shipment extends ShipmentCreate {
  id: number
  status: ShipmentStatus
  created_at: string
}

/* ---------------------------------------------------------------- routes */

/** app/schemas/route_recommendation.py :: RouteRecommendation */
export interface RouteRecommendation {
  id: number
  shipment_id: number
  path_nodes: number[]
  path_segments: number[]
  total_distance_km: number
  estimated_time_minutes: number
  average_risk_score: number
  average_confidence: number
  risk_penalty_used: number
  reason: string | null
  generated_at: string
  /** 1 = active, 0 = superseded */
  is_active: number
}

/* ---------------------------------------------------------------- alerts */

/** app/schemas/alert.py :: Alert */
export interface Alert {
  id: number
  route_recommendation_id: number
  shipment_id: number
  type: string
  message: string
  acknowledged: boolean
  created_at: string
}

/* ---------------------------------------------------------------- health */

export interface HealthStatus {
  status: string
}
