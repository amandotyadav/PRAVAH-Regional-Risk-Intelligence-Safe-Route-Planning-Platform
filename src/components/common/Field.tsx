import type { ReactNode } from 'react'

/** A label/value pair used throughout the detail panels. */
export default function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500">{label}</dt>
      <dd className="tabular mt-0.5 text-sm text-slate-900">{children}</dd>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
