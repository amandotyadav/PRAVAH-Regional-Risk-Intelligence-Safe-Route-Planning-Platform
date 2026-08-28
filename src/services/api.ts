import axios from "axios";
import type { RouteRequest } from "../types";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api", timeout: 10000 });
export const getHealth = () => api.get("/health");
export const getRiskMap = () => api.get("/risk-map");
export const calculateRoute = (request: RouteRequest) => api.post("/route", request);
export const submitReport = (report: FormData) => api.post("/reports", report);
export const getIncidents = () => api.get("/incidents");
export const getRoadStatus = () => api.get("/road-status");
export default api;
