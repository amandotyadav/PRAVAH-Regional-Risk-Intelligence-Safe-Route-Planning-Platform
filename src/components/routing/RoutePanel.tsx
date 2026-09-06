import { Crosshair, LocateFixed, Search } from 'lucide-react'
import type { CargoType, ShipmentPriority } from '../../types'
import type { PlaceSuggestion } from '../../services/geocoding'
import LocationSearchField from '../common/LocationSearchField'
import { formatCoordinate } from '../../utils/format'
import type { RoutePoint } from './types'

/** Values come straight from app/core/enums.py; only the wording is ours. */
const CARGO_OPTIONS: { value: CargoType; label: string }[] = [
  { value: 'emergency', label: 'Emergency supplies' },
  { value: 'medicine', label: 'Medicines' },
  { value: 'food', label: 'Food' },
  { value: 'commercial', label: 'Commercial goods' },
]

const PRIORITY_OPTIONS: { value: ShipmentPriority; label: string; hint: string }[] = [
  { value: 'critical', label: 'Critical', hint: 'Avoids risky roads as far as possible' },
  { value: 'high', label: 'High', hint: 'Prefers safer roads over shorter ones' },
  { value: 'normal', label: 'Normal', hint: 'Balances distance and road condition' },
]

export type PointSelection = 'origin' | 'destination'

/** Everything one location field (start or destination) needs to search and display. */
export interface LocationFieldState {
  query: string
  onQueryChange: (text: string) => void
  suggestions: PlaceSuggestion[]
  isSearching: boolean
  onSelect: (suggestion: PlaceSuggestion) => void
  point: RoutePoint | null
}

interface RoutePanelProps {
  originField: LocationFieldState
  destinationField: LocationFieldState
  activeSelection: PointSelection
  onActiveSelectionChange: (selection: PointSelection) => void
  cargoType: CargoType
  onCargoTypeChange: (value: CargoType) => void
  priority: ShipmentPriority
  onPriorityChange: (value: ShipmentPriority) => void
  onSubmit: () => void
  onClear: () => void
  onUseCurrentLocation: () => void
  isLocating: boolean
  locationMessage: string | null
  isSubmitting: boolean
  isReady: boolean
}

export default function RoutePanel({
  originField,
  destinationField,
  activeSelection,
  onActiveSelectionChange,
  cargoType,
  onCargoTypeChange,
  priority,
  onPriorityChange,
  onSubmit,
  onClear,
  onUseCurrentLocation,
  isLocating,
  locationMessage,
  isSubmitting,
  isReady,
}: RoutePanelProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">Where are you travelling?</legend>
        <p className="mt-0.5 text-xs text-slate-500">
          Type a place or road name, or tap a point on the map. Points snap to the nearest
          connected road.
        </p>
        <div className="mt-2.5 space-y-3">
          <LocationSearchField
            label="Starting point (A)"
            placeholder="Search for a place or road…"
            value={originField.query}
            onChange={originField.onQueryChange}
            suggestions={originField.suggestions}
            isLoading={originField.isSearching}
            isActive={activeSelection === 'origin'}
            onFocus={() => onActiveSelectionChange('origin')}
            onSelect={originField.onSelect}
            coordinateHint={originField.point ? formatCoordinate(originField.point.lat, originField.point.lon) : null}
          />
          <LocationSearchField
            label="Destination (B)"
            placeholder="Search for a place or road…"
            value={destinationField.query}
            onChange={destinationField.onQueryChange}
            suggestions={destinationField.suggestions}
            isLoading={destinationField.isSearching}
            isActive={activeSelection === 'destination'}
            onFocus={() => onActiveSelectionChange('destination')}
            onSelect={destinationField.onSelect}
            coordinateHint={
              destinationField.point
                ? formatCoordinate(destinationField.point.lat, destinationField.point.lon)
                : null
            }
          />
        </div>

        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {isLocating ? (
            <Crosshair className="h-4 w-4 animate-pulse" aria-hidden="true" />
          ) : (
            <LocateFixed className="h-4 w-4" aria-hidden="true" />
          )}
          {isLocating ? 'Finding your location…' : 'Use my current location'}
        </button>
        {locationMessage && <p className="mt-1.5 text-xs text-slate-600">{locationMessage}</p>}
      </fieldset>

      <div>
        <label htmlFor="cargo-type" className="block text-sm font-medium text-slate-900">
          What is being carried?
        </label>
        <select
          id="cargo-type"
          value={cargoType}
          onChange={(event) => onCargoTypeChange(event.target.value as CargoType)}
          className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        >
          {CARGO_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-slate-900">
          How urgent is this journey?
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as ShipmentPriority)}
          className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">
          {PRIORITY_OPTIONS.find((option) => option.value === priority)?.hint}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={!isReady || isSubmitting}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Finding a route…' : 'Find safe route'}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:min-h-0"
        >
          Clear
        </button>
      </div>

      {!isReady && (
        <p className="text-xs text-slate-500">Set both a starting point and a destination to continue.</p>
      )}
    </form>
  )
}
