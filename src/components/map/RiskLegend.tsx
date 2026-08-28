import { riskStyles } from "../../utils/risk";

function RiskLegend() {
  return <div className="pointer-events-none rounded-lg border border-slate-700/80 bg-slate-950/90 p-3 shadow-xl backdrop-blur"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk level</p><div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">{Object.entries(riskStyles).map(([level, style]) => <div className="flex items-center gap-2 text-[11px] text-slate-300" key={level}><span className={`h-2 w-2 rounded-full ${style.dot}`} />{style.label}</div>)}</div></div>;
}
export default RiskLegend;
