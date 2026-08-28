import type { IncidentStatus, RiskLevel } from "../types";

export const riskStyles: Record<RiskLevel, { label: string; dot: string; badge: string; map: string }> = {
  LOW: { label: "Low", dot: "bg-emerald-500", badge: "border-emerald-200 bg-emerald-50 text-emerald-700", map: "#16a34a" },
  MEDIUM: { label: "Medium", dot: "bg-amber-500", badge: "border-amber-200 bg-amber-50 text-amber-700", map: "#d97706" },
  HIGH: { label: "High", dot: "bg-orange-500", badge: "border-orange-200 bg-orange-50 text-orange-700", map: "#ea580c" },
  CRITICAL: { label: "Critical", dot: "bg-red-600", badge: "border-red-200 bg-red-50 text-red-700", map: "#dc2626" },
};

export const statusStyles: Record<IncidentStatus, string> = { REPORTED: "border-amber-200 bg-amber-50 text-amber-700", VERIFIED: "border-blue-200 bg-blue-50 text-blue-700", RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700" };
