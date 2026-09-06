import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  /** Set for map panels and similar content that supplies its own padding. */
  bodyless?: boolean
}

export default function Card({
  title,
  description,
  action,
  children,
  className = '',
  bodyless = false,
}: CardProps) {
  return (
    <section className={`rounded-md border border-slate-200 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={bodyless ? '' : 'p-4'}>{children}</div>
    </section>
  )
}
