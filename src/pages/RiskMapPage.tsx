import RiskMap from "../components/map/RiskMap";
function RiskMapPage() {
  return <div className="mx-auto max-w-[1600px] space-y-6"><section><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Live intelligence</p><h1 className="mt-2 text-2xl font-bold text-white">Northeast India Risk Map</h1><p className="mt-2 text-sm text-slate-400">Monitor active zones and field incidents. Select a marker for details.</p></section><section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"><RiskMap /></section></div>;
}

export default RiskMapPage;
