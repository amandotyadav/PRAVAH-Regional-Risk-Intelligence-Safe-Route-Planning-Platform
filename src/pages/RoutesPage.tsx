import { useCallback, useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import type { LatLngTuple } from 'leaflet'
import BaseMap from '../components/map/BaseMap'
import MapClickHandler from '../components/map/MapClickHandler'
import RoadNetworkLayer from '../components/map/RoadNetworkLayer'
import RouteLayer from '../components/map/RouteLayer'
import FitBounds from '../components/map/FitBounds'
import RoutePanel, { type PointSelection } from '../components/routing/RoutePanel'
import RouteSummary from '../components/routing/RouteSummary'
import type { RoutePoint } from '../components/routing/types'
import Card from '../components/common/Card'
import { ErrorState, LoadingState } from '../components/common/StateViews'
import { useRoadNetwork } from '../hooks/useRoadNetwork'
import { createShipment, getRoadGeometry, recommendRoute } from '../services/pravah'
import { isNotFound, toUserMessage } from '../services/errors'
import { buildRoutePaths, distanceMetres, nearestRoutableNode } from '../utils/geo'
import type { CargoType, RouteRecommendation, ShipmentPriority } from '../types'

interface RouteResult {
  recommendation: RouteRecommendation
  paths: LatLngTuple[][]
  /** Segments whose geometry the backend could not supply, if any. */
  missingGeometryCount: number
}

export default function RoutesPage() {
  const network = useRoadNetwork()

  const [origin, setOrigin] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [activeSelection, setActiveSelection] = useState<PointSelection>('origin')
  const [cargoType, setCargoType] = useState<CargoType>('emergency')
  const [priority, setPriority] = useState<ShipmentPriority>('critical')

  const [result, setResult] = useState<RouteResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [snapNotice, setSnapNotice] = useState<string | null>(null)

  const [isLocating, setIsLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)

  /** Snap a tapped point onto the connected road network the backend can route on. */
  const pickPoint = useCallback(
    (lat: number, lon: number, selection: PointSelection) => {
      if (!network.data) return

      const node = nearestRoutableNode(network.data, lat, lon)
      if (!node) {
        setSnapNotice('No connected road could be found near that point.')
        return
      }

      const snappedMetres = Math.round(distanceMetres(lat, lon, node.lat, node.lon))
      const point: RoutePoint = { lat: node.lat, lon: node.lon, nodeId: node.id, snappedMetres }

      if (selection === 'origin') {
        setOrigin(point)
        setActiveSelection('destination')
      } else {
        setDestination(point)
      }

      setSnapNotice(
        snappedMetres > 500
          ? `Moved to the nearest connected road, about ${(snappedMetres / 1000).toFixed(1)} km away.`
          : null,
      )
    },
    [network.data],
  )

  const handleMapPick = useCallback(
    (lat: number, lon: number) => pickPoint(lat, lon, activeSelection),
    [pickPoint, activeSelection],
  )

  const handleUseCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationMessage('This device cannot share its location. Tap the map instead.')
      return
    }

    setIsLocating(true)
    setLocationMessage(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false)
        pickPoint(position.coords.latitude, position.coords.longitude, activeSelection)
      },
      () => {
        setIsLocating(false)
        setLocationMessage('Location access was not granted. Tap the map to choose a point instead.')
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }, [pickPoint, activeSelection])

  const handleClear = useCallback(() => {
    setOrigin(null)
    setDestination(null)
    setActiveSelection('origin')
    setResult(null)
    setRouteError(null)
    setSnapNotice(null)
    setLocationMessage(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!origin || !destination) return

    setIsSubmitting(true)
    setRouteError(null)
    // Drop the previous route straight away so two results are never on screen.
    setResult(null)

    try {
      // The backend plans a route for a shipment, so one is created for this journey.
      const shipment = await createShipment({
        origin_lat: origin.lat,
        origin_lon: origin.lon,
        origin_node: origin.nodeId,
        destination_lat: destination.lat,
        destination_lon: destination.lon,
        destination_node: destination.nodeId,
        cargo_type: cargoType,
        priority,
      })

      const recommendation = await recommendRoute(shipment.id)

      // Full-precision geometry for the chosen segments, so the drawn line
      // follows the actual road rather than a simplified sketch of it.
      const geometry = await getRoadGeometry({ ids: recommendation.path_segments })
      const featureById = new Map(geometry.features.map((feature) => [feature.properties.id, feature]))
      const paths = buildRoutePaths(recommendation.path_nodes, recommendation.path_segments, featureById)
      const missingGeometryCount = recommendation.path_segments.filter((id) => !featureById.has(id)).length

      setResult({ recommendation, paths, missingGeometryCount })
    } catch (cause) {
      setRouteError(
        isNotFound(cause)
          ? 'No safe route could be found between these points. Every available road on this journey is currently blocked, badly affected, or not connected to the road network. Try a different starting point or destination.'
          : toUserMessage(cause, 'The route could not be calculated. Please try again.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [origin, destination, cargoType, priority])

  const originLatLng = useMemo<LatLngTuple | null>(
    () => (origin ? [origin.lat, origin.lon] : null),
    [origin],
  )
  const destinationLatLng = useMemo<LatLngTuple | null>(
    () => (destination ? [destination.lat, destination.lon] : null),
    [destination],
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Plan a safer journey</h2>
        <p className="mt-0.5 text-sm text-slate-600">
          Choose where you are starting from and where you are going. The route avoids roads that are
          reported blocked or at high risk.
        </p>
      </div>

      {network.error && <ErrorState message={network.error} onRetry={network.reload} />}

      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-3">
          <Card>
            {network.isLoading ? (
              <LoadingState message="Loading road information…" />
            ) : (
              <RoutePanel
                origin={origin}
                destination={destination}
                activeSelection={activeSelection}
                onActiveSelectionChange={setActiveSelection}
                cargoType={cargoType}
                onCargoTypeChange={setCargoType}
                priority={priority}
                onPriorityChange={setPriority}
                onSubmit={() => void handleSubmit()}
                onClear={handleClear}
                onUseCurrentLocation={handleUseCurrentLocation}
                isLocating={isLocating}
                locationMessage={locationMessage}
                isSubmitting={isSubmitting}
                isReady={origin !== null && destination !== null}
              />
            )}
          </Card>

          {snapNotice && (
            <p className="flex gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {snapNotice}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            {network.isLoading ? (
              <div className="px-4">
                <LoadingState message="Loading map…" />
              </div>
            ) : (
              <div className="h-[55vh] min-h-[340px] w-full lg:h-[62vh]">
                <BaseMap ariaLabel="Map for choosing a starting point and destination">
                  <FitBounds bounds={network.data?.bounds ?? null} disabled={result !== null} />
                  <MapClickHandler onPick={handleMapPick} />
                  {network.data && <RoadNetworkLayer features={network.data.features} />}
                  <RouteLayer
                    paths={result?.paths ?? []}
                    origin={originLatLng}
                    destination={destinationLatLng}
                    fitKey={result?.recommendation.id ?? null}
                  />
                </BaseMap>
              </div>
            )}
          </div>

          {isSubmitting && (
            <Card>
              <LoadingState message="Checking road conditions and finding the safest route…" />
            </Card>
          )}

          {routeError && !isSubmitting && (
            <ErrorState message={routeError} onRetry={() => void handleSubmit()} retryLabel="Try again" />
          )}

          {result && !isSubmitting && (
            <>
              <RouteSummary route={result.recommendation} />
              {result.missingGeometryCount > 0 && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                  {result.missingGeometryCount} of {result.recommendation.path_segments.length} road
                  segments on this route have no map outline available, so the line on the map is shown
                  in parts.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
