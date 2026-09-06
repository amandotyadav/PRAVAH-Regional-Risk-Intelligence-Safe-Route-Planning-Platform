import { X } from 'lucide-react'
import type { Incident, RiskAssessment, RoadFeature } from '../../types'
import RiskBadge from '../common/RiskBadge'
import Field from '../common/Field'
import ProbabilityBar from '../common/ProbabilityBar'
import {
  asPercent,
  hasPrediction,
  hasUnverifiedIncident,
  hasVerifiedIncident,
} from '../../utils/risk'
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_TYPE_LABELS,
  formatDateTime,
  formatDistanceKm,
  roadDisplayName,
  roadTypeLabel,
} from '../../utils/format'
import type { IncidentSeverity, IncidentType } from '../../types'

interface RiskDetailPanelProps {
  segmentId: number
  assessment: RiskAssessment | null
  feature: RoadFeature | null
  incidents: Incident[]
  onClose: () => void
}

/** Explains a road's rating using only the fields the backend returned. */
export default function RiskDetailPanel({
  segmentId,
  assessment,
  feature,
  incidents,
  onClose,
}: RiskDetailPanelProps) {
  const properties = feature?.properties
  const summary = assessment?.inputs_summary

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {roadDisplayName(properties?.name, segmentId)}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {properties ? `${roadTypeLabel(properties.road_type)} · Segment ${segmentId}` : `Segment ${segmentId}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-1 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close road details"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {assessment ? (
          <>
            <div>
              <RiskBadge state={assessment.state} size="md" />
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <Field label="Risk score">{asPercent(assessment.score)}</Field>
              <Field label="Confidence">{asPercent(assessment.confidence)}</Field>
              {summary && hasPrediction(summary) && (
                <Field label="Forecast covers">
                  {`Next ${summary.prediction.prediction_horizon_hours} hours`}
                </Field>
              )}
              {properties && <Field label="Segment length">{formatDistanceKm(properties.length_m / 1000)}</Field>}
            </dl>

            {summary && hasPrediction(summary) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Chance of disruption</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Forecast for the next {summary.prediction.prediction_horizon_hours} hours.
                </p>
                <div className="mt-3 space-y-3">
                  <ProbabilityBar
                    label="Landslide"
                    value={summary.prediction.landslide_probability}
                    color="#c2410c"
                  />
                  <ProbabilityBar
                    label="Road blockage"
                    value={summary.prediction.blockage_probability}
                    color="#b45309"
                  />
                  <ProbabilityBar
                    label="Flooding"
                    value={summary.prediction.flood_probability}
                    color="#1d4ed8"
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Assessed {formatDateTime(summary.prediction.predicted_at)}.
                </p>
              </div>
            )}

            {summary && (hasVerifiedIncident(summary) || hasUnverifiedIncident(summary)) && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-sm font-semibold text-slate-900">Why this rating</h3>
                {(() => {
                  const isVerified = hasVerifiedIncident(summary)
                  const reported = isVerified ? summary.incident : summary.unverified_incident
                  return (
                    <p className="mt-1 text-sm text-slate-700">
                      {isVerified ? 'A verified report of ' : 'An unverified report of '}
                      <span className="font-medium">
                        {(INCIDENT_TYPE_LABELS[reported.type as IncidentType] ?? reported.type).toLowerCase()}
                      </span>{' '}
                      on this road, severity{' '}
                      {(
                        INCIDENT_SEVERITY_LABELS[reported.severity as IncidentSeverity] ?? reported.severity
                      ).toLowerCase()}
                      .
                      {!isVerified && ' The rating will change if the report is confirmed.'}
                    </p>
                  )
                })()}
              </div>
            )}

            {summary && !hasPrediction(summary) && !hasVerifiedIncident(summary) && !hasUnverifiedIncident(summary) && (
              <p className="text-sm text-slate-600">
                There is not enough information about this road to assess its condition.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-600">
            No condition assessment is available for this road at the moment.
          </p>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Reports on this road{incidents.length > 0 ? ` (${incidents.length})` : ''}
          </h3>
          {incidents.length === 0 ? (
            <p className="mt-1 text-sm text-slate-600">No incidents have been reported here.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {incidents.map((incident) => (
                <li key={incident.id} className="rounded-md border border-slate-200 p-2.5">
                  <p className="text-sm font-medium text-slate-900">
                    {INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {INCIDENT_SEVERITY_LABELS[incident.severity] ?? incident.severity} severity ·{' '}
                    {incident.verified ? 'Verified' : 'Awaiting verification'}
                  </p>
                  {incident.description && (
                    <p className="mt-1 text-sm text-slate-700">{incident.description}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(incident.reported_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
