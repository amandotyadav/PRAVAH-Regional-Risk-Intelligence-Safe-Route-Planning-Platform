import { riskStyles } from "../../utils/risk";

function RiskLegend() {
  return <div className="pointer-events-none border border-slate-200 bg-white/95 p-3 shadow-sm"><p className="mb-2 text-xs font-medium text-slate-700">Risk level</p><div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">{Object.entries(riskStyles).map(([level, style]) => <div className="flex items-center gap-2 text-xs text-slate-600" key={level}><span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />{style.label}</div>)}</div></div>;
}
export default RiskLegend;
