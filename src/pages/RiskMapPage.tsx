import RiskMap from "../components/map/RiskMap";
function RiskMapPage() {
  return <div className="mx-auto max-w-[1440px] space-y-5"><section className="border-b border-slate-200 pb-5"><p className="text-sm font-medium text-slate-500">Live monitoring</p><h1 className="mt-1 text-2xl font-semibold text-slate-900">Northeast India risk map</h1><p className="mt-1.5 text-sm leading-6 text-slate-600">Select a report marker to see the incident, severity, status, location, and notes.</p></section><section className="overflow-hidden border border-slate-200 bg-white"><RiskMap /></section></div>;
}

export default RiskMapPage;
