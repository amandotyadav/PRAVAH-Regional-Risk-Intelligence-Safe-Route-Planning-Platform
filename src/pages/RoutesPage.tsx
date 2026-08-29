import { useState } from "react";
import RoutePanel from "../components/routing/RoutePanel";
import RouteSummary from "../components/routing/RouteSummary";
import RiskMap from "../components/map/RiskMap";
import { getSafeRoute } from "../services/api";
import type { RouteRequest, RouteResponse } from "../types";
function RoutesPage() {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function findRoute(request: RouteRequest) {
    setLoading(true);
    setError(null);
    setRoute(null);
    try {
      const result = await getSafeRoute(request);
      if (result.geometry.length < 2) throw new Error("Route geometry is missing.");
      setRoute(result);
    } catch {
      setError("Unable to calculate a safe route. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="mx-auto max-w-5xl space-y-5"><section className="border-b border-slate-200 pb-5"><p className="text-sm font-medium text-slate-500">Route planning</p><h1 className="mt-1 text-2xl font-semibold text-slate-900">Find Safe Route</h1><p className="mt-1.5 text-sm leading-6 text-slate-600">Choose your starting point and destination. We’ll help identify a route that avoids known hazards.</p></section><div className="grid gap-5 lg:grid-cols-2"><RoutePanel onSubmit={findRoute} loading={loading} />{route ? <RouteSummary route={route} /> : <div className="flex min-h-64 items-center justify-center border border-dashed border-slate-300 bg-white p-6 text-center text-sm leading-6 text-slate-500">{error ?? "Choose a starting location and destination to see the recommended route."}</div>}</div>{route && <section className="overflow-hidden border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Route Map</h2><p className="mt-1 text-sm text-slate-600">The highlighted route shows the full journey.</p></div><RiskMap route={route} /></section>}</div>;
}

export default RoutesPage;
