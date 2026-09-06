import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'

interface FitBoundsProps {
  bounds: LatLngBoundsExpression | null
  /** Skip fitting when something else already controls the view, e.g. a route. */
  disabled?: boolean
}

/**
 * Opens the map showing everything it has to show, once.
 *
 * A fixed centre and zoom level cuts off most of the road network on a narrow
 * screen; fitting the data's own extent works at every size. It runs a single
 * time so it never fights the user panning around afterwards.
 */
export default function FitBounds({ bounds, disabled = false }: FitBoundsProps) {
  const map = useMap()
  const hasFitted = useRef(false)

  useEffect(() => {
    if (!bounds || disabled || hasFitted.current) return
    hasFitted.current = true
    map.fitBounds(bounds, { padding: [16, 16] })
  }, [bounds, disabled, map])

  return null
}
