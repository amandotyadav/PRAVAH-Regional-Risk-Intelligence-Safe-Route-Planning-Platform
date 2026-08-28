import axios from "axios";
import { mockRoutes } from "../data/mockData";
import type { RouteCoordinates, RouteRequest, RouteResponse } from "../types";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api", timeout: 10000 });
export const getHealth = () => api.get("/health");
export const getRiskMap = () => api.get("/risk-map");
export const calculateRoute = (request: RouteRequest) => api.post("/route", request);
export const submitReport = (report: FormData) => api.post("/reports", report);
export const getIncidents = () => api.get("/incidents");
export const getRoadStatus = () => api.get("/road-status");

interface BackendRouteResponse {
  distance: string | number;
  estimatedTime?: string;
  duration?: string | number;
  riskScore: number;
  riskLevel: RouteResponse["riskLevel"];
  avoidedSegments: number;
  geometry: RouteCoordinates | { coordinates: [longitude: number, latitude: number][] };
}

function toLeafletCoordinates(geometry: BackendRouteResponse["geometry"]): RouteCoordinates {
  if (Array.isArray(geometry)) return geometry;
  return geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
}

function normalizeRoute(response: BackendRouteResponse, request: RouteRequest): RouteResponse {
  return {
    distance: typeof response.distance === "number" ? `${response.distance} km` : response.distance,
    estimatedTime: response.estimatedTime ?? (typeof response.duration === "number" ? `${response.duration} min` : response.duration ?? "—"),
    riskScore: response.riskScore,
    riskLevel: response.riskLevel,
    avoidedSegments: response.avoidedSegments,
    geometry: toLeafletCoordinates(response.geometry),
    origin: request.origin,
    destination: request.destination,
  };
}

export async function getSafeRoute(request: RouteRequest): Promise<RouteResponse> {
  if (!import.meta.env.VITE_API_BASE_URL) {
    const route = mockRoutes[`${request.origin}:${request.destination}`];
    if (!route) throw new Error("No mock route is available for this journey.");
    return route;
  }
  const response = await calculateRoute(request);
  return normalizeRoute(response.data as BackendRouteResponse, request);
}
export default api;
