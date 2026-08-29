import {
  AlertTriangle,
  FileWarning,
  Navigation,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import { dashboardStats } from "../data/mockData";
import RiskMap from "../components/map/RiskMap";
import { Link } from "react-router-dom";

function Dashboard() {
  const [layers, setLayers] = useState({ risk: true, roads: true, incidents: true });
  const layerButtons = [{ key: "risk", label: "Risk" }, { key: "roads", label: "Roads" }, { key: "incidents", label: "Incidents" }] as const;
  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Northeast Region · Current risk information
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
            Current Risk Overview
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            View current risk areas, road conditions, and reported incidents across the region.
          </p>
        </div>

        <Link to="/reports" className="border border-blue-700 bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-800">Report Incident</Link>
      </section>

      {/* Statistics */}
      <section className="grid divide-y divide-slate-200 border-y border-slate-200 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        <StatCard
          title="High Risk Zones"
          value={dashboardStats.highRiskZones}
          description="Across the region"
          icon={ShieldAlert}
          variant="danger"
        />

        <StatCard
          title="Active Incidents"
          value={dashboardStats.activeIncidents}
          description="4 require verification"
          icon={AlertTriangle}
          variant="warning"
        />

        <StatCard
          title="Blocked Roads"
          value={dashboardStats.blockedRoads}
          description="Currently verified"
          icon={FileWarning}
          variant="danger"
        />

        <StatCard
          title="Monitored Routes"
          value={dashboardStats.routesMonitored}
          description="Currently monitored"
          icon={Navigation}
          variant="success"
        />
      </section>

      {/* Map section */}
      <section className="overflow-hidden border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Current risk information
            </p>

            <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Risk Map</h2>
          </div>

          <div className="flex border border-slate-200 bg-slate-50">{layerButtons.map(({ key, label }) => <button key={key} onClick={() => setLayers((current) => ({ ...current, [key]: !current[key] }))} aria-pressed={layers[key]} className={`border-r border-slate-200 px-3 py-2 text-xs font-medium last:border-r-0 transition ${layers[key] ? "bg-white text-blue-700" : "text-slate-500 hover:bg-white hover:text-slate-800"}`}>{label}</button>)}</div>
        </div>

        <RiskMap compact layers={layers} />
      </section>
    </div>
  );
}

export default Dashboard;
