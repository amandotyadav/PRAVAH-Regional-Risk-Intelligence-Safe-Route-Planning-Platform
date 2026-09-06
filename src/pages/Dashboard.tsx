import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Check, FilePlus2, Map, RefreshCw, Route } from 'lucide-react'
import Card from '../components/common/Card'
import SummaryTile from '../components/dashboard/SummaryTile'
import RiskBreakdown from '../components/dashboard/RiskBreakdown'
import { EmptyState, ErrorState, LoadingState } from '../components/common/StateViews'
import { SeverityTag, VerificationTag } from '../components/incidents/IncidentCard'
import { useApiResource } from '../hooks/useApiResource'
import { acknowledgeAlert, getAlerts, getIncidents, getRoadRisks } from '../services/pravah'
import { toUserMessage } from '../services/errors'
import { RISK_PRESENTATION } from '../utils/risk'
import { INCIDENT_TYPE_LABELS, formatRelativeTime, roadDisplayName } from '../utils/format'

const QUICK_ACTIONS = [
  { to: '/risk-map', label: 'Check road conditions', icon: Map },
  { to: '/routes', label: 'Plan a safer journey', icon: Route },
  { to: '/reports', label: 'Report a road problem', icon: FilePlus2 },
]

export default function Dashboard() {
  const risks = useApiResource(getRoadRisks, [], {
    errorMessage: 'Road condition information could not be loaded.',
  })
  const incidents = useApiResource(() => getIncidents(), [], {
    errorMessage: 'Incident reports could not be loaded.',
  })
  const alerts = useApiResource(() => getAlerts({ acknowledged: false }), [], {
    errorMessage: 'Route warnings could not be loaded.',
  })

  // Tracked locally: which warning is mid-request, and one that failed.
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null)
  const [acknowledgeError, setAcknowledgeError] = useState<string | null>(null)

  const handleAcknowledge = async (alertId: number) => {
    setAcknowledgingId(alertId)
    setAcknowledgeError(null)
    try {
      await acknowledgeAlert(alertId)
      alerts.reload()
    } catch (cause) {
      setAcknowledgeError(toUserMessage(cause, 'The warning could not be acknowledged. Please try again.'))
    } finally {
      setAcknowledgingId(null)
    }
  }

  const summary = useMemo(() => {
    const assessments = risks.data ?? []
    const blocked = assessments.filter(
      (assessment) => assessment.state === 'CRITICAL' || assessment.state === 'HIGH',
    ).length
    const watch = assessments.filter((assessment) => assessment.state === 'MODERATE').length
    return { total: assessments.length, blocked, watch }
  }, [risks.data])

  const recentIncidents = useMemo(
    () =>
      [...(incidents.data ?? [])]
        .sort((a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime())
        .slice(0, 5),
    [incidents.data],
  )

  const reloadAll = () => {
    risks.reload()
    incidents.reload()
    alerts.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">Current conditions</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            An overview of road conditions and reported problems across the Northeast Region.
          </p>
        </div>
        <button
          type="button"
          onClick={reloadAll}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Unacknowledged route warnings raised by the backend's own monitor. */}
      {(alerts.data?.length ?? 0) > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3.5" role="status">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900">
                {alerts.data?.length} route warning{alerts.data?.length === 1 ? '' : 's'}{' '}
                {alerts.data?.length === 1 ? 'needs' : 'need'} attention
              </p>
              <ul className="mt-2 space-y-2">
                {alerts.data?.slice(0, 3).map((alert) => (
                  <li key={alert.id} className="flex flex-wrap items-start justify-between gap-2">
                    <span className="text-sm text-amber-900">{alert.message}</span>
                    <button
                      type="button"
                      onClick={() => void handleAcknowledge(alert.id)}
                      disabled={acknowledgingId === alert.id}
                      className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {acknowledgingId === alert.id ? 'Acknowledging…' : 'Acknowledge'}
                    </button>
                  </li>
                ))}
              </ul>
              {acknowledgeError && <p className="mt-2 text-sm text-red-800">{acknowledgeError}</p>}
            </div>
          </div>
        </div>
      )}

      {risks.error && <ErrorState message={risks.error} onRetry={risks.reload} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryTile
          label="Roads monitored"
          value={risks.isLoading ? '—' : summary.total.toLocaleString()}
          hint="Segments with a current assessment"
        />
        <SummaryTile
          label="Roads to avoid"
          value={risks.isLoading ? '—' : summary.blocked.toLocaleString()}
          hint="High or critical condition"
          accent={summary.blocked > 0 ? RISK_PRESENTATION.CRITICAL.stroke : undefined}
        />
        <SummaryTile
          label="Roads to watch"
          value={risks.isLoading ? '—' : summary.watch.toLocaleString()}
          hint="Moderate condition"
          accent={summary.watch > 0 ? RISK_PRESENTATION.MODERATE.stroke : undefined}
        />
        <SummaryTile
          label="Reported incidents"
          value={incidents.isLoading ? '—' : (incidents.data?.length ?? 0).toLocaleString()}
          hint="Reports currently on record"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Road conditions" description="How the monitored road network is rated right now.">
          {risks.isLoading ? (
            <LoadingState message="Loading road conditions…" />
          ) : risks.error ? (
            <ErrorState message={risks.error} onRetry={risks.reload} />
          ) : (risks.data?.length ?? 0) === 0 ? (
            <EmptyState
              title="No road information available"
              description="No road segments have been loaded into the service yet."
            />
          ) : (
            <RiskBreakdown assessments={risks.data ?? []} />
          )}
        </Card>

        <Card
          title="Latest reports"
          description="The most recent problems reported on the road network."
          action={
            <Link
              to="/incidents"
              className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              View all
            </Link>
          }
          bodyless
        >
          {incidents.isLoading ? (
            <div className="px-4">
              <LoadingState message="Loading reports…" />
            </div>
          ) : incidents.error ? (
            <div className="p-4">
              <ErrorState message={incidents.error} onRetry={incidents.reload} />
            </div>
          ) : recentIncidents.length === 0 ? (
            <EmptyState
              title="No incidents reported"
              description="Nothing has been reported on the road network yet."
              icon={<AlertTriangle className="h-4.5 w-4.5" aria-hidden="true" />}
              action={
                <Link
                  to="/reports"
                  className="inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Report an incident
                </Link>
              }
            />
          ) : (
            <ul>
              {recentIncidents.map((incident) => (
                <li key={incident.id} className="border-b border-slate-100 px-4 py-3 last:border-b-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
                    </p>
                    <SeverityTag severity={incident.severity} />
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {roadDisplayName(null, incident.road_segment_id)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <VerificationTag verified={incident.verified} />
                    <span className="text-xs text-slate-500">
                      {formatRelativeTime(incident.reported_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="What would you like to do?">
        <ul className="grid gap-2 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <li key={action.to}>
              <Link
                to={action.to}
                className="flex min-h-12 items-center gap-2.5 rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <action.icon className="h-4.5 w-4.5 shrink-0 text-slate-500" aria-hidden="true" />
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
