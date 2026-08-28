export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "REPORTED" | "VERIFIED" | "RESOLVED";

export interface DashboardStats {
  highRiskZones: number;
  activeIncidents: number;
  blockedRoads: number;
  routesMonitored: number;
}

export interface RiskZone {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface Incident {
  id: string;
  type: string;
  severity: RiskLevel;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  description: string;
}

export interface RouteRequest { origin: string; destination: string; }
export interface RouteResponse { distance: string; estimatedTime: string; riskLevel: RiskLevel; riskScore: number; avoidedSegments: number; }
