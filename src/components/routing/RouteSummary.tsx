import { CheckCircle2 } from 'lucide-react'
import type { RouteRecommendation } from '../../types'
import RiskBadge from '../common/RiskBadge'
import Field from '../common/Field'
import { asPercent, bandRouteScore } from '../../utils/risk'
import { formatDateTime, formatDistanceKm, formatDuration } from '../../utils/format'

interface RouteSummaryProps {
  route: RouteRecommendation
}

/** Shows only the values the backend returned for the recommendation. */
export default function RouteSummary({ route }: RouteSummaryProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green-700" aria-hidden="true" />
            Recommended route
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Prepared {formatDateTime(route.generated_at)}
          </p>
        </div>
        <RiskBadge state={bandRouteScore(route.average_risk_score)} />
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 sm:grid-cols-4">
        <Field label="Distance">{formatDistanceKm(route.total_distance_km)}</Field>
        <Field label="Estimated time">{formatDuration(route.estimated_time_minutes)}</Field>
        <Field label="Average road risk">{asPercent(route.average_risk_score)}</Field>
        <Field label="Confidence">{asPercent(route.average_confidence)}</Field>
      </dl>

      {route.reason && (
        <div className="border-t border-slate-200 px-4 py-3">
          <h3 className="text-xs font-medium tracking-wide text-slate-500">About this route</h3>
          <p className="mt-1 text-sm text-slate-700">{route.reason}</p>
        </div>
      )}

      <div className="border-t border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500">
          Follows {route.path_segments.length} road segment
          {route.path_segments.length === 1 ? '' : 's'}. Road conditions can change; check for new
          reports before setting out.
        </p>
      </div>
    </div>
  )
}
