import { Route } from "lucide-react";
import { locations } from "../../data/mockData";
import type { RouteRequest } from "../../types";

function RoutePanel({ onSubmit }: { onSubmit: (request: RouteRequest) => void }) {
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); onSubmit({ origin: String(data.get("origin")), destination: String(data.get("destination")) }); }
  return <form onSubmit={submit} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-base font-semibold">Plan a safer journey</h2><p className="mt-1 text-sm text-slate-400">We’ll prioritize roads with lower incident and landslide risk.</p><div className="mt-6 space-y-4"><label className="block text-xs font-medium text-slate-300">From<select required name="origin" defaultValue="" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"><option value="" disabled>Select starting location</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-xs font-medium text-slate-300">To<select required name="destination" defaultValue="" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"><option value="" disabled>Select destination</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label><button className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"><Route size={16} />Find safest route</button></div></form>;
}
export default RoutePanel;
