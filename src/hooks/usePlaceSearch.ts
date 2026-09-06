import { useEffect, useRef, useState } from 'react'
import { searchPlaces, type PlaceSuggestion } from '../services/geocoding'
import type { RoadNetwork } from '../utils/geo'

const DEBOUNCE_MS = 350
const MIN_QUERY_LENGTH = 2

export interface PlaceSearchState {
  suggestions: PlaceSuggestion[]
  isLoading: boolean
}

/**
 * Debounced place search for one text field. Stale responses are dropped by
 * request id, so a fast typist never sees an older query's results land after
 * a newer one.
 */
export function usePlaceSearch(query: string, network: RoadNetwork | null): PlaceSearchState {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const requestId = useRef(0)

  const trimmed = query.trim()
  const tooShort = !network || trimmed.length < MIN_QUERY_LENGTH

  useEffect(() => {
    // A query too short to search cancels any pending request; the "no
    // results" state below is derived directly rather than stored, so there
    // is nothing to reset here.
    if (tooShort) {
      requestId.current += 1
      return
    }

    const thisRequest = ++requestId.current
    setIsLoading(true)

    const timer = window.setTimeout(() => {
      searchPlaces(trimmed, network)
        .then((result) => {
          if (requestId.current !== thisRequest) return
          setSuggestions(result.suggestions)
        })
        .finally(() => {
          if (requestId.current === thisRequest) setIsLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, network, tooShort])

  return { suggestions: tooShort ? [] : suggestions, isLoading: tooShort ? false : isLoading }
}
