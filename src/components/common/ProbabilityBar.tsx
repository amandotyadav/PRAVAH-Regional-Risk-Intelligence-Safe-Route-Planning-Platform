import { asPercent } from '../../utils/risk'

interface ProbabilityBarProps {
  label: string
  value: number
  /** Semantic colour of the filled portion. */
  color: string
}

/** A labelled 0-100% bar. The number is always shown, not just the bar. */
export default function ProbabilityBar({ label, value, color }: ProbabilityBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-slate-700">{label}</span>
        <span className="tabular text-sm font-medium text-slate-900">{asPercent(value)}</span>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`${label}: ${percent} percent`}
      >
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
