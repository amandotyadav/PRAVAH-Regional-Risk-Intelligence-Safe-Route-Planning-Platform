import type { ReactNode } from 'react'

interface SummaryTileProps {
  label: string
  value: ReactNode
  hint?: string
  /** Semantic accent, used only where the number carries a risk meaning. */
  accent?: string
}

export default function SummaryTile({ label, value, hint, accent }: SummaryTileProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="tabular mt-1 text-2xl font-semibold" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
