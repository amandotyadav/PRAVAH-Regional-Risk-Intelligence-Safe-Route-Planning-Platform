import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { incidents, riskZones } from "../../data/mockData";
import { riskStyles } from "../../utils/risk";
import IncidentMarkers from "./IncidentMarkers";
import RiskLegend from "./RiskLegend";
interface RiskMapProps { compact?: boolean; layers?: { risk: boolean; roads: boolean; incidents: boolean }; }
function RiskMap({ compact = false, layers = { risk: true, roads: true, incidents: true } }: RiskMapProps) {
  return <div className={`isolate z-0 relative overflow-hidden ${compact ? "h-[360px] sm:h-[480px] lg:h-[560px]" : "h-[420px] sm:h-[540px] lg:h-[650px]"}`}><MapContainer center={[26.4, 90.6]} zoom={6} scrollWheelZoom className="h-full w-full" aria-label="Northeast India risk map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{layers.risk && riskZones.map((zone) => <Circle key={zone.id} center={[zone.latitude, zone.longitude]} radius={zone.radius} pathOptions={{ color: riskStyles[zone.riskLevel].map, fillColor: riskStyles[zone.riskLevel].map, fillOpacity: .22, weight: 2 }} />)}{layers.roads && <Polyline positions={[[27.34, 88.61], [27.04, 88.27], [26.73, 88.40]]} pathOptions={{ color: "#2563eb", weight: 4, opacity: .85 }} />}{layers.incidents && <IncidentMarkers incidents={incidents} />}</MapContainer>{layers.risk && <div className="absolute bottom-3 left-3 z-[500]"><RiskLegend /></div>}</div>;
}
export default RiskMap;
