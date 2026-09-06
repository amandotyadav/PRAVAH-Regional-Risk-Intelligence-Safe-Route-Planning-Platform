import { useApiResource } from './useApiResource'
import { loadRoadNetwork } from '../services/roadNetwork'
import type { RoadNetwork } from '../utils/geo'
import type { ApiResource } from './useApiResource'

export function useRoadNetwork(enabled = true): ApiResource<RoadNetwork> {
  return useApiResource<RoadNetwork>(loadRoadNetwork, [], {
    enabled,
    errorMessage: 'Road information could not be loaded.',
  })
}
