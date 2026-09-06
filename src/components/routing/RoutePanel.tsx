import { Crosshair, LocateFixed, Search } from 'lucide-react'
import type { CargoType, ShipmentPriority } from '../../types'
import type { RoutePoint } from './types'
import { formatCoordinate } from '../../utils/format'

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

interface RoutePanelProps {
  origin: RoutePoint | null
  destination: RoutePoint | null
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

function PointButton({
  label,
  point,
  isActive,
  onClick,
}: {
  label: string
  point: RoutePoint | null
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`w-full rounded-md border px-3 py-2.5 text-left ${
        isActive ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {isActive && <span className="text-xs font-medium text-blue-700">Tap the map</span>}
      </span>
      <span className="tabular mt-1 block text-sm text-slate-900">
        {point ? formatCoordinate(point.lat, point.lon) : 'Not set'}
      </span>
    </button>
  )
}

export default function RoutePanel({
  origin,
  destination,
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
          Choose a box, then tap a point on the map. Points snap to the nearest connected road.
        </p>
        <div className="mt-2.5 space-y-2">
          <PointButton
            label="Starting point (A)"
            point={origin}
            isActive={activeSelection === 'origin'}
            onClick={() => onActiveSelectionChange('origin')}
          />
          <PointButton
            label="Destination (B)"
            point={destination}
            isActive={activeSelection === 'destination'}
            onClick={() => onActiveSelectionChange('destination')}
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
