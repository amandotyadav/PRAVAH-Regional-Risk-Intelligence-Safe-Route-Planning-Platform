import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type { Incident } from "../../types";
import { riskStyles, statusStyles } from "../../utils/risk";
const markerIcon = (color: string) => divIcon({ className: "incident-marker", html: `<span style="background:${color}"></span>`, iconSize: [18, 18], iconAnchor: [9, 9] });
function IncidentMarkers({ incidents }: { incidents: Incident[] }) {
  return <>{incidents.map((incident) => <Marker key={incident.id} position={[incident.latitude, incident.longitude]} icon={markerIcon(riskStyles[incident.severity].map)}><Popup><div className="min-w-48 font-sans text-slate-900"><div className="flex items-center justify-between gap-2"><strong>{incident.type}</strong><span className="text-xs">{incident.severity}</span></div><p className="mt-1 text-xs text-slate-600">{incident.location}</p><p className="mt-2 text-xs">{incident.description}</p><span className={`mt-2 inline-block rounded border px-1.5 py-0.5 text-[10px] font-semibold ${statusStyles[incident.status]}`}>{incident.status}</span></div></Popup></Marker>)}</>;
}
export default IncidentMarkers;
