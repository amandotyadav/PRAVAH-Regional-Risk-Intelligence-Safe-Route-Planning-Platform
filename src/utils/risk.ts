import type { IncidentStatus, RiskLevel } from "../types";

export const riskStyles: Record<RiskLevel, { label: string; dot: string; badge: string; map: string }> = {
  LOW: { label: "Low", dot: "bg-emerald-400", badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300", map: "#34d399" },
  MEDIUM: { label: "Medium", dot: "bg-amber-400", badge: "border-amber-400/25 bg-amber-400/10 text-amber-300", map: "#fbbf24" },
  HIGH: { label: "High", dot: "bg-orange-400", badge: "border-orange-400/25 bg-orange-400/10 text-orange-300", map: "#fb923c" },
  CRITICAL: { label: "Critical", dot: "bg-red-400", badge: "border-red-400/25 bg-red-400/10 text-red-300", map: "#f87171" },
};

export const statusStyles: Record<IncidentStatus, string> = { REPORTED: "border-amber-400/25 bg-amber-400/10 text-amber-300", VERIFIED: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300", RESOLVED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" };
