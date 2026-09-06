import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import BaseMap from '../components/map/BaseMap'
import RoadRiskLayer, { type RoadRiskEntry } from '../components/map/RoadRiskLayer'
import RiskLegend from '../components/map/RiskLegend'
import RiskDetailPanel from '../components/map/RiskDetailPanel'
import IncidentMarkers from '../components/map/IncidentMarkers'
import RoadTypeFilter, { MAJOR_ROAD_TYPES, type RoadScope } from '../components/map/RoadTypeFilter'
import FitBounds from '../components/map/FitBounds'
import { ErrorState, LoadingState } from '../components/common/StateViews'
import { useRoadNetwork } from '../hooks/useRoadNetwork'
import { useApiResource } from '../hooks/useApiResource'
import { getIncidents, getRoadRisks } from '../services/pravah'
import type { Incident, RiskAssessment, RiskState } from '../types'
import { RISK_STATES } from '../utils/risk'

export default function RiskMapPage() {
  const network = useRoadNetwork()
  const risks = useApiResource(getRoadRisks, [], {
    errorMessage: 'Road condition information could not be loaded.',
  })
  const incidents = useApiResource(() => getIncidents(), [], {
    errorMessage: 'Incident reports could not be loaded.',
  })

  const [scope, setScope] = useState<RoadScope>('major')
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(null)

  const riskBySegment = useMemo(() => {
    const map = new Map<number, RiskAssessment>()
    for (const assessment of risks.data ?? []) {
      map.set(assessment.road_segment_id, assessment)
    }
    return map
  }, [risks.data])

  /** One drawable entry per road, pairing its geometry with its backend risk state. */
  const entries = useMemo<RoadRiskEntry[]>(() => {
    if (!network.data) return []
    return network.data.features
      .filter((feature) => scope === 'all' || MAJOR_ROAD_TYPES.has(feature.properties.road_type))
      .map((feature) => ({
        feature,
        state: (riskBySegment.get(feature.properties.id)?.state ?? 'UNKNOWN') as RiskState,
      }))
  }, [network.data, riskBySegment, scope])

  const counts = useMemo(() => {
    const tally: Record<string, number> = {}
    for (const state of RISK_STATES) tally[state] = 0
    for (const entry of entries) tally[entry.state] = (tally[entry.state] ?? 0) + 1
    return tally
  }, [entries])

  const incidentsBySegment = useMemo(() => {
    const map = new Map<number, Incident[]>()
    for (const incident of incidents.data ?? []) {
      const existing = map.get(incident.road_segment_id)
      if (existing) existing.push(incident)
      else map.set(incident.road_segment_id, [incident])
    }
    return map
  }, [incidents.data])

  // A road hidden by the filter should not stay selected, so the panel follows
  // what is actually on the map rather than being cleared by a second render.
  const visibleSelectedId = useMemo(() => {
    if (selectedSegmentId === null) return null
    return entries.some((entry) => entry.feature.properties.id === selectedSegmentId)
      ? selectedSegmentId
      : null
  }, [entries, selectedSegmentId])

  const isLoading = network.isLoading || risks.isLoading
  const error = network.error ?? risks.error

  const reloadAll = () => {
    network.reload()
    risks.reload()
    incidents.reload()
  }

  const selectedFeature =
    visibleSelectedId !== null ? (network.data?.featureById.get(visibleSelectedId) ?? null) : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">Road conditions</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Tap a road to see its current condition and any reports on it.
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

      {error && <ErrorState message={error} onRetry={reloadAll} />}

      {/* Controls sit above the map on mobile and beside it from large screens up. */}
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="order-2 overflow-hidden rounded-md border border-slate-200 bg-white lg:order-1">
          {isLoading ? (
            <div className="px-4">
              <LoadingState message="Loading road conditions…" />
            </div>
          ) : (
            <div className="h-[60vh] min-h-[380px] w-full lg:h-[70vh]">
              <BaseMap ariaLabel="Map of road conditions across the Northeast Region">
                <FitBounds bounds={network.data?.bounds ?? null} />
                <RoadRiskLayer
                  entries={entries}
                  selectedSegmentId={visibleSelectedId}
                  onSelect={setSelectedSegmentId}
                />
                {network.data && (
                  <IncidentMarkers
                    incidents={incidents.data ?? []}
                    featureById={network.data.featureById}
                  />
                )}
              </BaseMap>
            </div>
          )}
        </div>

        <div className="order-1 space-y-3 lg:order-2">
          <RoadTypeFilter value={scope} onChange={setScope} />
          <RiskLegend counts={counts} />
          <p className="px-1 text-xs text-slate-500">
            {entries.length.toLocaleString()} road segments shown. Conditions are reassessed each time
            this page is refreshed.
          </p>
        </div>
      </div>

      {visibleSelectedId !== null && (
        <>
          {/* Small screens: a sheet anchored to the bottom of the viewport. */}
          <div className="fixed inset-x-0 bottom-0 z-30 max-h-[70vh] rounded-t-lg border-t border-slate-200 bg-white shadow-[0_-2px_12px_rgba(15,23,42,0.12)] lg:hidden">
            <RiskDetailPanel
              segmentId={visibleSelectedId}
              assessment={riskBySegment.get(visibleSelectedId) ?? null}
              feature={selectedFeature}
              incidents={incidentsBySegment.get(visibleSelectedId) ?? []}
              onClose={() => setSelectedSegmentId(null)}
            />
          </div>

          <div className="hidden rounded-md border border-slate-200 bg-white lg:block">
            <RiskDetailPanel
              segmentId={visibleSelectedId}
              assessment={riskBySegment.get(visibleSelectedId) ?? null}
              feature={selectedFeature}
              incidents={incidentsBySegment.get(visibleSelectedId) ?? []}
              onClose={() => setSelectedSegmentId(null)}
            />
          </div>
        </>
      )}
    </div>
  )
}
