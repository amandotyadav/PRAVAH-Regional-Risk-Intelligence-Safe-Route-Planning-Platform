import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Card from '../components/common/Card'
import { EmptyState, ErrorState, LoadingState } from '../components/common/StateViews'
import IncidentCard, { SeverityTag, VerificationTag } from '../components/incidents/IncidentCard'
import { useApiResource } from '../hooks/useApiResource'
import { useRoadNetwork } from '../hooks/useRoadNetwork'
import { getIncidents } from '../services/pravah'
import type { IncidentType } from '../types'
import {
  INCIDENT_TYPE_LABELS,
  formatDateTime,
  formatRelativeTime,
  roadDisplayName,
} from '../utils/format'

type VerificationFilter = 'all' | 'verified' | 'unverified'
type TypeFilter = 'all' | IncidentType

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'blocked', label: INCIDENT_TYPE_LABELS.blocked },
  { value: 'landslide', label: INCIDENT_TYPE_LABELS.landslide },
  { value: 'flood', label: INCIDENT_TYPE_LABELS.flood },
  { value: 'bridge_damage', label: INCIDENT_TYPE_LABELS.bridge_damage },
  { value: 'other', label: INCIDENT_TYPE_LABELS.other },
]

const VERIFICATION_FILTERS: { value: VerificationFilter; label: string }[] = [
  { value: 'all', label: 'All reports' },
  { value: 'verified', label: 'Verified only' },
  { value: 'unverified', label: 'Awaiting verification' },
]

export default function IncidentsPage() {
  const [verification, setVerification] = useState<VerificationFilter>('all')
  const [type, setType] = useState<TypeFilter>('all')

  // The backend filters by verification; type is narrowed here on the result.
  const incidents = useApiResource(
    () => getIncidents(verification === 'all' ? {} : { verified: verification === 'verified' }),
    [verification],
    { errorMessage: 'Incident reports could not be loaded.' },
  )
  const network = useRoadNetwork()

  const visible = useMemo(() => {
    const all = incidents.data ?? []
    const filtered = type === 'all' ? all : all.filter((incident) => incident.type === type)
    return [...filtered].sort(
      (a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime(),
    )
  }, [incidents.data, type])

  const featureById = network.data?.featureById

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">Reported incidents</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Road problems reported across the region, most recent first.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={incidents.reload}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
          <Link
            to="/reports"
            className="inline-flex min-h-9 items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Report an incident
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-type" className="block text-sm font-medium text-slate-900">
            Type of problem
          </label>
          <select
            id="filter-type"
            value={type}
            onChange={(event) => setType(event.target.value as TypeFilter)}
            className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {TYPE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-verification" className="block text-sm font-medium text-slate-900">
            Verification
          </label>
          <select
            id="filter-verification"
            value={verification}
            onChange={(event) => setVerification(event.target.value as VerificationFilter)}
            className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {VERIFICATION_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {incidents.error && <ErrorState message={incidents.error} onRetry={incidents.reload} />}

      <Card bodyless>
        {incidents.isLoading ? (
          <div className="px-4">
            <LoadingState message="Loading incident reports…" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title="No incidents match these filters"
            description={
              incidents.data?.length === 0
                ? 'No road problems have been reported yet.'
                : 'Try widening the filters above to see more reports.'
            }
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
          <>
            {/* Small screens: one card per report. */}
            <div className="md:hidden">
              {visible.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  feature={featureById?.get(incident.road_segment_id)}
                />
              ))}
            </div>

            {/* Wider screens: the same information as a table. */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Incidents reported across the region</caption>
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                    <th scope="col" className="px-4 py-2.5">Problem</th>
                    <th scope="col" className="px-4 py-2.5">Location</th>
                    <th scope="col" className="px-4 py-2.5">Severity</th>
                    <th scope="col" className="px-4 py-2.5">Status</th>
                    <th scope="col" className="px-4 py-2.5">Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((incident) => (
                    <tr key={incident.id} className="border-b border-slate-100 align-top last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">
                          {INCIDENT_TYPE_LABELS[incident.type] ?? incident.type}
                        </span>
                        {incident.description && (
                          <span className="mt-0.5 block max-w-md text-slate-600">
                            {incident.description}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {roadDisplayName(
                          featureById?.get(incident.road_segment_id)?.properties.name,
                          incident.road_segment_id,
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SeverityTag severity={incident.severity} />
                      </td>
                      <td className="px-4 py-3">
                        <VerificationTag verified={incident.verified} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="block">{formatDateTime(incident.reported_at)}</span>
                        <span className="block text-xs text-slate-500">
                          {formatRelativeTime(incident.reported_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {visible.length > 0 && (
        <p className="px-1 text-xs text-slate-500">
          Showing {visible.length} report{visible.length === 1 ? '' : 's'}.
        </p>
      )}
    </div>
  )
}
