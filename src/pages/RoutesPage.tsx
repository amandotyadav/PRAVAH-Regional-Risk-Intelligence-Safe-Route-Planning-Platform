import { useState } from "react";
import RoutePanel from "../components/routing/RoutePanel";
import RouteSummary from "../components/routing/RouteSummary";
import { routeResult } from "../data/mockData";
import type { RouteRequest } from "../types";
function RoutesPage() {
  const [request, setRequest] = useState<RouteRequest | null>(null);
  return <div className="mx-auto max-w-5xl space-y-5"><section className="border-b border-slate-200 pb-5"><p className="text-sm font-medium text-slate-500">Journey planning</p><h1 className="mt-1 text-2xl font-semibold text-slate-900">Find a safer route</h1><p className="mt-1.5 text-sm leading-6 text-slate-600">Plan around verified blocks and areas with elevated landslide risk.</p></section><div className="grid gap-5 lg:grid-cols-2"><RoutePanel onSubmit={setRequest} />{request ? <RouteSummary route={routeResult} /> : <div className="flex min-h-64 items-center justify-center border border-dashed border-slate-300 bg-white p-6 text-center text-sm leading-6 text-slate-500">Choose a starting location and destination to see the recommended route.</div>}</div></div>;
}

export default RoutesPage;
