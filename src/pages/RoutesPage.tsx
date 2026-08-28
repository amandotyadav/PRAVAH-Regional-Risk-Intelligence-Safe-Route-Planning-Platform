import { useState } from "react";
import RoutePanel from "../components/routing/RoutePanel";
import RouteSummary from "../components/routing/RouteSummary";
import { routeResult } from "../data/mockData";
import type { RouteRequest } from "../types";
function RoutesPage() {
  const [request, setRequest] = useState<RouteRequest | null>(null);
  return <div className="mx-auto max-w-5xl space-y-6"><section><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Route intelligence</p><h1 className="mt-2 text-2xl font-bold">Safe Routes</h1><p className="mt-2 text-sm text-slate-400">Calculate routes that avoid verified blocks and high-risk road segments.</p></section><div className="grid gap-6 lg:grid-cols-2"><RoutePanel onSubmit={setRequest} />{request ? <RouteSummary route={routeResult} /> : <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 p-6 text-center text-sm text-slate-500">Choose a start and destination to calculate a safe route.</div>}</div></div>;
}

export default RoutesPage;
