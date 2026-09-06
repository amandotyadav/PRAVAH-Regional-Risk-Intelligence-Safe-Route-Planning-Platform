export type RoadScope = 'major' | 'all'

/** Road classes shown when "main roads" is selected. */
export const MAJOR_ROAD_TYPES = new Set<string>([
  'motorway',
  'motorway_link',
  'trunk',
  'trunk_link',
  'primary',
  'primary_link',
  'secondary',
  'secondary_link',
])

interface RoadTypeFilterProps {
  value: RoadScope
  onChange: (scope: RoadScope) => void
}

const OPTIONS: { value: RoadScope; label: string }[] = [
  { value: 'major', label: 'Main roads' },
  { value: 'all', label: 'All roads' },
]

export default function RoadTypeFilter({ value, onChange }: RoadTypeFilterProps) {
  return (
    <fieldset className="rounded-md border border-slate-200 bg-white p-3">
      <legend className="px-1 text-xs font-medium text-slate-500">Show</legend>
      <div className="flex gap-2">
        {OPTIONS.map((option) => {
          const isSelected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`min-h-9 flex-1 rounded-md border px-3 py-1.5 text-sm ${
                isSelected
                  ? 'border-slate-800 bg-slate-800 font-medium text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
