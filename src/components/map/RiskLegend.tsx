import { RISK_PRESENTATION, RISK_STATES } from '../../utils/risk'

interface RiskLegendProps {
  /** Segment counts per risk state, when available. */
  counts?: Record<string, number>
}

export default function RiskLegend({ counts }: RiskLegendProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">Road condition</p>
      <ul className="mt-2 space-y-1.5">
        {RISK_STATES.map((state) => {
          const presentation = RISK_PRESENTATION[state]
          const count = counts?.[state]
          return (
            <li key={state} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="h-1 w-5 shrink-0 rounded-full"
                style={{ backgroundColor: presentation.stroke }}
              />
              <span className="flex-1 text-slate-700">{presentation.label}</span>
              {count !== undefined && <span className="tabular text-slate-500">{count}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
