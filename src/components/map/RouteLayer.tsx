import { useEffect } from 'react'
import { Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngTuple } from 'leaflet'
import { boundsOfPaths } from '../../utils/geo'

interface RouteLayerProps {
  /** Road-following paths built from the recommended route's segments. */
  paths: LatLngTuple[][]
  origin: LatLngTuple | null
  destination: LatLngTuple | null
  /** Re-fits the view whenever this changes, i.e. for each new recommendation. */
  fitKey: number | string | null
}

function endpointIcon(color: string, label: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:${color};color:#fff;border:2px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.45);font:600 11px/1 system-ui,sans-serif">${label}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

const ORIGIN_ICON = endpointIcon('#1d4ed8', 'A')
const DESTINATION_ICON = endpointIcon('#0f172a', 'B')

/**
 * Draws the recommended route and brings it into view.
 *
 * Every previous route is replaced because the layer renders only the paths it
 * is given, and the view is refitted for each new recommendation so the result
 * never has to be hunted for on the map.
 */
export default function RouteLayer({ paths, origin, destination, fitKey }: RouteLayerProps) {
  const map = useMap()

  useEffect(() => {
    if (fitKey === null) return

    const points = [...paths]
    if (origin) points.push([origin])
    if (destination) points.push([destination])

    const bounds = boundsOfPaths(points)
    if (!bounds) return

    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [fitKey, map, paths, origin, destination])

  return (
    <>
      {paths.map((path, index) => (
        // A casing line underneath keeps the route legible over busy map tiles.
        <Polyline
          key={`casing-${index}`}
          positions={path}
          pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.95 }}
          interactive={false}
        />
      ))}
      {paths.map((path, index) => (
        <Polyline
          key={`route-${index}`}
          positions={path}
          pathOptions={{ color: '#1d4ed8', weight: 5, opacity: 1 }}
          interactive={false}
        />
      ))}

      {origin && (
        <Marker position={origin} icon={ORIGIN_ICON} title="Starting point">
          <Popup>Starting point</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={DESTINATION_ICON} title="Destination">
          <Popup>Destination</Popup>
        </Marker>
      )}
    </>
  )
}
