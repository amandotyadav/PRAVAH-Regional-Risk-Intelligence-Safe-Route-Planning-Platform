import type { DashboardStats, Incident, RiskZone, RouteResponse } from "../types";

export const dashboardStats: DashboardStats = {
  highRiskZones: 23,
  activeIncidents: 12,
  blockedRoads: 4,
  routesMonitored: 8,
};

export const riskZones: RiskZone[] = [
  {
    id: "RZ-001",
    name: "Sikkim Corridor", riskScore: 21, latitude: 27.37, longitude: 88.61, radius: 15000,
    riskLevel: "LOW",
  },
  {
    id: "RZ-002",
    name: "Darjeeling Hills", riskScore: 47, latitude: 27.04, longitude: 88.27, radius: 16000,
    riskLevel: "MEDIUM",
  },
  {
    id: "RZ-003",
    name: "Tawang Approach", riskScore: 71, latitude: 27.59, longitude: 91.87, radius: 18000,
    riskLevel: "HIGH",
  },
  {
    id: "RZ-004",
    name: "Aizawl Ridge", riskScore: 91, latitude: 23.73, longitude: 92.72, radius: 14000,
    riskLevel: "CRITICAL",
  },
];

export const incidents: Incident[] = [
  {
    id: "INC-001",
    type: "Blocked Road",
    severity: "HIGH",
    status: "VERIFIED",
    latitude: 27.3389,
    longitude: 88.6065,
    location: "NH-10, Gangtok", timestamp: "18 min ago",
    description: "Debris blocking one lane.",
  },
  {
    id: "INC-002",
    type: "Landslide",
    severity: "CRITICAL",
    status: "REPORTED",
    latitude: 26.7271,
    longitude: 88.3953,
    location: "Hill Cart Road, Siliguri", timestamp: "42 min ago",
    description: "Fresh slope failure reported.",
  },
  { id: "INC-003", type: "Road damage", severity: "MEDIUM", status: "VERIFIED", latitude: 27.0844, longitude: 93.6053, location: "Bomdila–Tawang Road", timestamp: "1 hr ago", description: "Surface washout affecting light vehicles." },
  { id: "INC-004", type: "Flooding", severity: "HIGH", status: "RESOLVED", latitude: 26.1445, longitude: 91.7362, location: "Guwahati bypass", timestamp: "3 hrs ago", description: "Water cleared; route reopened to monitored traffic." },
];

export const routeResult: RouteResponse = { distance: "81.4 km", estimatedTime: "1h 50m", riskLevel: "LOW", riskScore: 12, avoidedSegments: 2 };
export const locations = ["Gangtok", "Siliguri", "Guwahati", "Tawang", "Aizawl", "Shillong"];
