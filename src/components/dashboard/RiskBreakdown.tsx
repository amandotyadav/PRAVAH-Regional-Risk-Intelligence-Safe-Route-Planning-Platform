import { Link } from 'react-router-dom'
import type { RiskAssessment, RiskState } from '../../types'
import { RISK_PRESENTATION, RISK_STATES } from '../../utils/risk'

interface RiskBreakdownProps {
  assessments: RiskAssessment[]
}

/** How many roads sit in each condition, as a share of everything monitored. */
export default function RiskBreakdown({ assessments }: RiskBreakdownProps) {
  const counts: Record<RiskState, number> = {
    LOW: 0,
    MODERATE: 0,
    HIGH: 0,
    CRITICAL: 0,
    UNKNOWN: 0,
  }
  for (const assessment of assessments) {
    counts[assessment.state] = (counts[assessment.state] ?? 0) + 1
  }
  const total = assessments.length || 1

  return (
    <div>
      <ul className="space-y-3">
        {RISK_STATES.map((state) => {
          const presentation = RISK_PRESENTATION[state]
          const count = counts[state]
          const share = Math.round((count / total) * 100)
          return (
            <li key={state}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-700">{presentation.label}</span>
                <span className="tabular text-sm text-slate-900">
                  <span className="font-medium">{count.toLocaleString()}</span>
                  <span className="ml-1.5 text-xs text-slate-500">{share}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${share}%`, backgroundColor: presentation.stroke }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <Link
        to="/risk-map"
        className="mt-4 inline-block text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
      >
        View these roads on the map
      </Link>
    </div>
  )
}
