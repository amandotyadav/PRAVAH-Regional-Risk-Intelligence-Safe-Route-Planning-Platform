import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { RiskState, RoadFeature } from '../../types'
import { riskPresentation } from '../../utils/risk'
import { toLatLngs } from '../../utils/geo'

export interface RoadRiskEntry {
  feature: RoadFeature
  state: RiskState
}

interface RoadRiskLayerProps {
  entries: RoadRiskEntry[]
  selectedSegmentId: number | null
  onSelect: (segmentId: number) => void
}

/**
 * Draws every road segment coloured by its backend risk state.
 *
 * Leaflet objects are created directly rather than as React elements: the layer
 * routinely holds a few thousand lines, and reconciling that many components on
 * each selection change is far slower than updating two styles by hand.
 */
export default function RoadRiskLayer({ entries, selectedSegmentId, onSelect }: RoadRiskLayerProps) {
  const map = useMap()
  const linesRef = useRef(new Map<number, L.Polyline>())
  const previousSelection = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)

  // Kept current in an effect so the layer below never rebuilds just because the
  // page passed a new callback identity.
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    // `tolerance` widens the clickable area around each line, so a 3px road is
    // still comfortable to tap with a finger without drawing thicker lines.
    const renderer = L.canvas({ padding: 0.3, tolerance: 8 })
    const group = L.layerGroup().addTo(map)
    const lines = new Map<number, L.Polyline>()

    for (const { feature, state } of entries) {
      const coordinates = toLatLngs(feature.geometry.coordinates)
      if (coordinates.length < 2) continue

      const segmentId = feature.properties.id
      const line = L.polyline(coordinates, {
        renderer,
        color: riskPresentation(state).stroke,
        weight: 3,
        opacity: 0.9,
        bubblingMouseEvents: false,
      })

      line.on('click', () => onSelectRef.current(segmentId))
      line.addTo(group)
      lines.set(segmentId, line)
    }

    linesRef.current = lines
    previousSelection.current = null

    return () => {
      group.remove()
      lines.clear()
    }
  }, [entries, map])

  // Highlight the selected road without rebuilding the layer.
  useEffect(() => {
    const lines = linesRef.current

    const previous = previousSelection.current
    if (previous !== null && previous !== selectedSegmentId) {
      lines.get(previous)?.setStyle({ weight: 3, opacity: 0.9 })
    }

    if (selectedSegmentId !== null) {
      const line = lines.get(selectedSegmentId)
      if (line) {
        line.setStyle({ weight: 7, opacity: 1 })
        line.bringToFront()
      }
    }

    previousSelection.current = selectedSegmentId
  }, [selectedSegmentId, entries])

  return null
}
