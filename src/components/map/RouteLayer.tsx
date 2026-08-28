import { divIcon, latLngBounds } from "leaflet";
import { Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { RouteResponse } from "../../types";

const endpointIcon = (label: string, color: string) => divIcon({
  className: "route-endpoint-marker",
  html: `<span style="background:${color}">${label}</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FitRouteBounds({ geometry }: Pick<RouteResponse, "geometry">) {
  const map = useMap();
  useEffect(() => {
    if (geometry.length > 1) map.fitBounds(latLngBounds(geometry), { padding: [40, 40] });
  }, [geometry, map]);
  return null;
}

function RouteLayer({ route }: { route: RouteResponse }) {
  const start = route.geometry[0];
  const destination = route.geometry.at(-1);
  if (!start || !destination) return null;
  return <><FitRouteBounds geometry={route.geometry} /><Polyline positions={route.geometry} pathOptions={{ color: "#1d4ed8", weight: 5, opacity: 0.9 }} /><Marker position={start} icon={endpointIcon("S", "#15803d")}><Popup><strong>Start</strong><br />{route.origin}</Popup></Marker><Marker position={destination} icon={endpointIcon("D", "#b91c1c")}><Popup><strong>Destination</strong><br />{route.destination}</Popup></Marker></>;
}

export default RouteLayer;
