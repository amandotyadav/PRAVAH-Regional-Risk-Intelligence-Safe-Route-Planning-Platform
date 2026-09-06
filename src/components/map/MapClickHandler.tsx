import { useMapEvents } from 'react-leaflet'

interface MapClickHandlerProps {
  onPick: (lat: number, lon: number) => void
}

/** Reports taps on the map to the surrounding page. */
export default function MapClickHandler({ onPick }: MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}
