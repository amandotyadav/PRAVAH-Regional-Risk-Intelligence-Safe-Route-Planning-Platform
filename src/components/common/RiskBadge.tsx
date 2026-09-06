import type { RiskState } from '../../types'
import { riskPresentation } from '../../utils/risk'

interface RiskBadgeProps {
  state: RiskState
  size?: 'sm' | 'md'
}

/**
 * Risk is always spelled out in words next to its colour, so the meaning does
 * not depend on colour perception.
 */
export default function RiskBadge({ state, size = 'sm' }: RiskBadgeProps) {
  const presentation = riskPresentation(state)
  const padding = size === 'md' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium ${padding} ${presentation.bg} ${presentation.text} ${presentation.border}`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: presentation.stroke }}
      />
      {presentation.label}
    </span>
  )
}
