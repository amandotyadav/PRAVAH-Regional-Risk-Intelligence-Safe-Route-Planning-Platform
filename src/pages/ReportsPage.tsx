import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import BaseMap from '../components/map/BaseMap'
import MapClickHandler from '../components/map/MapClickHandler'
import RoadNetworkLayer from '../components/map/RoadNetworkLayer'
import FitBounds from '../components/map/FitBounds'
import ReportForm, { type ReportFormValues } from '../components/reports/ReportForm'
import Card from '../components/common/Card'
import { ErrorState, LoadingState } from '../components/common/StateViews'
import { useRoadNetwork } from '../hooks/useRoadNetwork'
import { createIncident } from '../services/pravah'
import { toUserMessage } from '../services/errors'
import { midpointOf, nearestFeature } from '../utils/geo'
import type { Incident, RoadFeature } from '../types'
import { INCIDENT_TYPE_LABELS, formatDateTime, roadDisplayName } from '../utils/format'

const SELECTED_ICON = L.divIcon({
  className: '',
  html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#b91c1c;border:3px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.5)"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const INITIAL_VALUES: ReportFormValues = {
  type: 'blocked',
  severity: 'high',
  source: 'manual',
  description: '',
}

export default function ReportsPage() {
  const network = useRoadNetwork()

  const [values, setValues] = useState<ReportFormValues>(INITIAL_VALUES)
  const [selectedRoad, setSelectedRoad] = useState<RoadFeature | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<Incident | null>(null)

  const [isLocating, setIsLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)

  const selectRoadNear = useCallback(
    (lat: number, lon: number) => {
      if (!network.data) return
      const feature = nearestFeature(network.data.features, lat, lon)
      if (!feature) {
        setLocationMessage('No road could be found near that point.')
        return
      }
      setSelectedRoad(feature)
      setLocationMessage(null)
    },
    [network.data],
  )

  const handleUseCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationMessage('This device cannot share its location. Tap the road on the map instead.')
      return
    }

    setIsLocating(true)
    setLocationMessage(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false)
        selectRoadNear(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setIsLocating(false)
        setLocationMessage('Location access was not granted. Tap the road on the map instead.')
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }, [selectRoadNear])

  const handleSubmit = useCallback(async () => {
    if (!selectedRoad) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const incident = await createIncident({
        road_segment_id: selectedRoad.properties.id,
        type: values.type,
        severity: values.severity,
        source: values.source,
        description: values.description.trim() === '' ? null : values.description.trim(),
        // New reports are never sent as verified; the backend decides that.
        verified: false,
      })
      setSubmitted(incident)
    } catch (cause) {
      setSubmitError(toUserMessage(cause, 'The report could not be sent. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedRoad, values])

  const handleReportAnother = useCallback(() => {
    setSubmitted(null)
    setValues(INITIAL_VALUES)
    setSelectedRoad(null)
    setSubmitError(null)
  }, [])

  const markerPosition = useMemo(
    () => (selectedRoad ? midpointOf(selectedRoad.geometry.coordinates) : null),
    [selectedRoad],
  )

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-700" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Report received</h2>
            <p className="mt-1 text-sm text-slate-600">
              Thank you. Your report has been recorded and is now visible to others using PRAVAH.
            </p>
          </div>

          <dl className="mt-5 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Reference</dt>
              <dd className="tabular font-medium text-slate-900">#{submitted.id}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Problem</dt>
              <dd className="font-medium text-slate-900">
                {INCIDENT_TYPE_LABELS[submitted.type] ?? submitted.type}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Location</dt>
              <dd className="text-right font-medium text-slate-900">
                {roadDisplayName(selectedRoad?.properties.name, submitted.road_segment_id)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Status</dt>
              <dd className="font-medium text-slate-900">
                {submitted.verified ? 'Verified' : 'Awaiting verification'}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Recorded</dt>
              <dd className="text-right text-slate-900">{formatDateTime(submitted.reported_at)}</dd>
            </div>
          </dl>

          {!submitted.verified && (
            <p className="mt-3 text-xs text-slate-500">
              Reports are checked before they are marked as verified. Until then this report is shown as
              awaiting verification.
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleReportAnother}
              className="min-h-11 flex-1 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Report another problem
            </button>
            <Link
              to="/incidents"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View all incidents
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Report a road problem</h2>
        <p className="mt-0.5 text-sm text-slate-600">
          Tell others about a blocked or damaged road so journeys can be planned around it.
        </p>
      </div>

      {network.error && <ErrorState message={network.error} onRetry={network.reload} />}

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="order-2 overflow-hidden rounded-md border border-slate-200 bg-white lg:order-1">
          {network.isLoading ? (
            <div className="px-4">
              <LoadingState message="Loading map…" />
            </div>
          ) : (
            <div className="h-[45vh] min-h-[300px] w-full lg:h-[60vh]">
              <BaseMap ariaLabel="Map for selecting the affected road">
                <FitBounds bounds={network.data?.bounds ?? null} />
                <MapClickHandler onPick={selectRoadNear} />
                {network.data && <RoadNetworkLayer features={network.data.features} />}
                {markerPosition && <Marker position={markerPosition} icon={SELECTED_ICON} title="Selected road" />}
              </BaseMap>
            </div>
          )}
        </div>

        <div className="order-1 space-y-3 lg:order-2">
          <Card>
            {network.isLoading ? (
              <LoadingState message="Loading road information…" />
            ) : (
              <ReportForm
                values={values}
                onChange={setValues}
                selectedRoad={selectedRoad}
                onUseCurrentLocation={handleUseCurrentLocation}
                isLocating={isLocating}
                locationMessage={locationMessage}
                onSubmit={() => void handleSubmit()}
                isSubmitting={isSubmitting}
              />
            )}
          </Card>

          {submitError && <ErrorState message={submitError} onRetry={() => void handleSubmit()} />}
        </div>
      </div>
    </div>
  )
}
