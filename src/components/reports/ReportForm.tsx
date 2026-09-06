import { LocateFixed, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import type { IncidentSeverity, IncidentType, RoadFeature } from '../../types'
import { INCIDENT_SEVERITY_LABELS, INCIDENT_TYPE_LABELS, roadDisplayName, roadTypeLabel } from '../../utils/format'

/** Values are the backend's enums; only the wording shown here is ours. */
const TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
  { value: 'blocked', label: INCIDENT_TYPE_LABELS.blocked },
  { value: 'landslide', label: INCIDENT_TYPE_LABELS.landslide },
  { value: 'flood', label: INCIDENT_TYPE_LABELS.flood },
  { value: 'bridge_damage', label: INCIDENT_TYPE_LABELS.bridge_damage },
  { value: 'other', label: INCIDENT_TYPE_LABELS.other },
]

const SEVERITY_OPTIONS: { value: IncidentSeverity; label: string; hint: string }[] = [
  { value: 'low', label: INCIDENT_SEVERITY_LABELS.low, hint: 'Passable with care' },
  { value: 'medium', label: INCIDENT_SEVERITY_LABELS.medium, hint: 'Slow or difficult to pass' },
  { value: 'high', label: INCIDENT_SEVERITY_LABELS.high, hint: 'Barely passable' },
  { value: 'critical', label: INCIDENT_SEVERITY_LABELS.critical, hint: 'Not passable at all' },
]

/**
 * The backend records who reported an incident as a free-text `source`. These
 * are the values its own code documents, shown here in plain language.
 */
const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'manual', label: 'A person on the ground' },
  { value: 'emergency_report', label: 'Emergency services' },
]

export interface ReportFormValues {
  type: IncidentType
  severity: IncidentSeverity
  source: string
  description: string
}

interface ReportFormProps {
  values: ReportFormValues
  onChange: (values: ReportFormValues) => void
  selectedRoad: RoadFeature | null
  onUseCurrentLocation: () => void
  isLocating: boolean
  locationMessage: string | null
  onSubmit: () => void
  isSubmitting: boolean
}

export default function ReportForm({
  values,
  onChange,
  selectedRoad,
  onUseCurrentLocation,
  isLocating,
  locationMessage,
  onSubmit,
  isSubmitting,
}: ReportFormProps) {
  const update = <K extends keyof ReportFormValues>(key: K, value: ReportFormValues[K]) =>
    onChange({ ...values, [key]: value })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Where is the problem?</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Tap the road on the map, or use your current location.
        </p>

        <div
          className={`mt-2 rounded-md border px-3 py-2.5 ${
            selectedRoad ? 'border-slate-300 bg-slate-50' : 'border-dashed border-slate-300 bg-white'
          }`}
        >
          {selectedRoad ? (
            <>
              <p className="text-sm font-medium text-slate-900">
                {roadDisplayName(selectedRoad.properties.name, selectedRoad.properties.id)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {roadTypeLabel(selectedRoad.properties.road_type)} · Segment{' '}
                {selectedRoad.properties.id}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-600">No road selected yet.</p>
          )}
        </div>

        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <LocateFixed className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} aria-hidden="true" />
          {isLocating ? 'Finding your location…' : 'Use my current location'}
        </button>
        {locationMessage && <p className="mt-1.5 text-xs text-slate-600">{locationMessage}</p>}
      </div>

      <div>
        <label htmlFor="report-type" className="block text-sm font-medium text-slate-900">
          What is the problem?
        </label>
        <select
          id="report-type"
          value={values.type}
          onChange={(event) => update('type', event.target.value as IncidentType)}
          className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          required
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="report-severity" className="block text-sm font-medium text-slate-900">
          How bad is it?
        </label>
        <select
          id="report-severity"
          value={values.severity}
          onChange={(event) => update('severity', event.target.value as IncidentSeverity)}
          className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          required
        >
          {SEVERITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} — {option.hint}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="report-source" className="block text-sm font-medium text-slate-900">
          Who is reporting this?
        </label>
        <select
          id="report-source"
          value={values.source}
          onChange={(event) => update('source', event.target.value)}
          className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          required
        >
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="report-description" className="block text-sm font-medium text-slate-900">
          Anything else to add? <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="report-description"
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="For example: mud and rocks across both lanes near the bridge."
          className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!selectedRoad || isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? 'Sending report…' : 'Submit report'}
      </button>

      {!selectedRoad && (
        <p className="text-xs text-slate-500">Select the affected road on the map to continue.</p>
      )}
    </form>
  )
}
