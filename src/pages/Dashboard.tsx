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
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            Northeast India
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Good evening, Administrator
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Monitor landslide risk, road conditions and emergency incidents
            across the region.
          </p>
        </div>

        <Link to="/reports" className="rounded-lg bg-cyan-400 px-4 py-2.5 text-center text-xs font-bold text-slate-950 transition hover:bg-cyan-300">+ Report Incident</Link>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="High Risk Zones"
          value={dashboardStats.highRiskZones}
          description="Across monitored region"
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
          title="Routes Monitored"
          value={dashboardStats.routesMonitored}
          description="2 active journeys"
          icon={Navigation}
          variant="success"
        />
      </section>

      {/* Map section */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              Live Monitoring
            </p>

            <h2 className="mt-1 text-base font-semibold">Regional Risk Map</h2>
          </div>

          <div className="flex gap-1 rounded-lg bg-slate-950 p-1">{layerButtons.map(({ key, label }) => <button key={key} onClick={() => setLayers((current) => ({ ...current, [key]: !current[key] }))} aria-pressed={layers[key]} className={`rounded-md px-3 py-1.5 text-[10px] font-medium transition ${layers[key] ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-200"}`}>{label}</button>)}</div>
        </div>

        <RiskMap compact layers={layers} />
      </section>
    </div>
  );
}

export default Dashboard;
