import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'
import type { Incident, RoadFeature } from '../../types'
import { midpointOf } from '../../utils/geo'
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_TYPE_LABELS,
  formatDateTime,
  roadDisplayName,
} from '../../utils/format'

const SEVERITY_COLOR: Record<string, string> = {
  low: '#15803d',
  medium: '#b45309',
  high: '#c2410c',
  critical: '#b91c1c',
}

/** A small filled pin, drawn inline so no image assets are needed. */
function markerIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:15px;height:15px;border-radius:9999px;background:${color};border:2.5px solid #fff;box-shadow:0 1px 3px rgba(15,23,42,.45)"></span>`,
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5],
    popupAnchor: [0, -8],
  })
}

interface IncidentMarkersProps {
  incidents: Incident[]
  featureById: Map<number, RoadFeature>
}

/**
 * Incidents are recorded against a road segment rather than a coordinate, so
 * each marker sits at the midpoint of the road it was reported on. Incidents on
 * roads that are not loaded are skipped rather than placed at a guessed point.
 */
export default function IncidentMarkers({ incidents, featureById }: IncidentMarkersProps) {
  const placed = useMemo(
    () =>
      incidents.flatMap((incident) => {
        const feature = featureById.get(incident.road_segment_id)
        if (!feature) return []
        const position = midpointOf(feature.geometry.coordinates)
        if (!position) return []
        return [{ incident, feature, position }]
      }),
    [incidents, featureById],
  )

  return (
    <>
      {placed.map(({ incident, feature, position }) => (
        <Marker
          key={incident.id}
          position={position}
          icon={markerIcon(SEVERITY_COLOR[incident.severity] ?? '#475569')}
          title={INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
        >
          <Popup>
            <p className="font-semibold text-slate-900">
              {INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
            </p>
            <p className="mt-0.5 text-slate-700">
              {roadDisplayName(feature.properties.name, incident.road_segment_id)}
            </p>
            <p className="mt-1 text-slate-600">
              Severity: {INCIDENT_SEVERITY_LABELS[incident.severity] ?? incident.severity}
              <br />
              {incident.verified ? 'Verified' : 'Awaiting verification'}
              <br />
              Reported {formatDateTime(incident.reported_at)}
            </p>
            {incident.description && <p className="mt-1 text-slate-700">{incident.description}</p>}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
