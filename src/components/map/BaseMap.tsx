import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngTuple, Map as LeafletMap } from 'leaflet'
import type { ReactNode } from 'react'

/** Centre of the Guwahati - Shillong corridor covered by the road data. */
export const REGION_CENTER: LatLngTuple = [25.81, 91.78]
export const REGION_ZOOM = 10

/** Extent of the loaded road network, used as a sensible maximum view. */
export const REGION_BOUNDS: LatLngBoundsExpression = [
  [25.0, 90.9],
  [26.7, 92.6],
]

interface BaseMapProps {
  children: ReactNode
  center?: LatLngTuple
  zoom?: number
  className?: string
  whenReady?: (map: LeafletMap) => void
  ariaLabel: string
}

export default function BaseMap({
  children,
  center = REGION_CENTER,
  zoom = REGION_ZOOM,
  className = 'h-full w-full',
  ariaLabel,
}: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={7}
      maxZoom={18}
      scrollWheelZoom
      // Canvas keeps thousands of road segments responsive; SVG does not.
      preferCanvas
      className={className}
      aria-label={ariaLabel}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {children}
    </MapContainer>
  )
}
