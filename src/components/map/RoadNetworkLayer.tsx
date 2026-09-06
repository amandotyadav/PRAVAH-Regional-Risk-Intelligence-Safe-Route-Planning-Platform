import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { RoadFeature } from '../../types'
import { toLatLngs } from '../../utils/geo'

interface RoadNetworkLayerProps {
  features: RoadFeature[]
}

/**
 * A plain grey drawing of the road network, shown behind a route so it is clear
 * where roads run and where a journey can start or end.
 */
export default function RoadNetworkLayer({ features }: RoadNetworkLayerProps) {
  const map = useMap()

  useEffect(() => {
    const renderer = L.canvas({ padding: 0.3 })
    const group = L.layerGroup().addTo(map)

    for (const feature of features) {
      const coordinates = toLatLngs(feature.geometry.coordinates)
      if (coordinates.length < 2) continue
      L.polyline(coordinates, {
        renderer,
        color: '#94a3b8',
        weight: 2,
        opacity: 0.65,
        interactive: false,
      }).addTo(group)
    }

    return () => {
      group.remove()
    }
  }, [features, map])

  return null
}
