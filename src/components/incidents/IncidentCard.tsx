import { MapPin } from 'lucide-react'
import type { Incident, RoadFeature } from '../../types'
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_SEVERITY_STYLES,
  INCIDENT_TYPE_LABELS,
  formatDateTime,
  formatRelativeTime,
  roadDisplayName,
  roadTypeLabel,
} from '../../utils/format'

export function VerificationTag({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
      Awaiting verification
    </span>
  )
}

export function SeverityTag({ severity }: { severity: Incident['severity'] }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
        INCIDENT_SEVERITY_STYLES[severity] ?? 'border-slate-300 bg-slate-100 text-slate-700'
      }`}
    >
      {INCIDENT_SEVERITY_LABELS[severity] ?? severity} severity
    </span>
  )
}

interface IncidentCardProps {
  incident: Incident
  feature: RoadFeature | undefined
}

/** The mobile presentation of an incident; the desktop table shows the same data. */
export default function IncidentCard({ incident, feature }: IncidentCardProps) {
  return (
    <article className="border-b border-slate-200 px-4 py-3.5 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
        </h3>
        <SeverityTag severity={incident.severity} />
      </div>

      <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-700">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span>
          {roadDisplayName(feature?.properties.name, incident.road_segment_id)}
          {feature && (
            <span className="block text-xs text-slate-500">
              {roadTypeLabel(feature.properties.road_type)}
            </span>
          )}
        </span>
      </p>

      {incident.description && <p className="mt-2 text-sm text-slate-700">{incident.description}</p>}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <VerificationTag verified={incident.verified} />
        <span className="text-xs text-slate-500">
          {formatDateTime(incident.reported_at)} · {formatRelativeTime(incident.reported_at)}
        </span>
      </div>
    </article>
  )
}
