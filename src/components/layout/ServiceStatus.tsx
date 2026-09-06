import { useEffect, useState } from 'react'
import { getLiveness, getReadiness } from '../../services/pravah'

type Status = 'checking' | 'available' | 'degraded' | 'unavailable'

const PRESENTATION: Record<Status, { label: string; dot: string; text: string }> = {
  checking: { label: 'Checking service', dot: 'bg-slate-400', text: 'text-slate-600' },
  available: { label: 'Service available', dot: 'bg-green-600', text: 'text-slate-700' },
  degraded: { label: 'Limited service', dot: 'bg-amber-500', text: 'text-amber-800' },
  unavailable: { label: 'Service unavailable', dot: 'bg-red-600', text: 'text-red-800' },
}

/** Polls the backend's own health endpoints. Nothing here is simulated. */
export function useServiceStatus(intervalMs = 60_000): Status {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    let active = true

    const check = async () => {
      try {
        await getLiveness()
      } catch {
        if (active) setStatus('unavailable')
        return
      }

      try {
        const ready = await getReadiness()
        if (active) setStatus(ready.status === 'ready' ? 'available' : 'degraded')
      } catch {
        // The service answered but its database did not.
        if (active) setStatus('degraded')
      }
    }

    void check()
    const timer = window.setInterval(() => void check(), intervalMs)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [intervalMs])

  return status
}

export function ServiceStatusIndicator({ status }: { status: Status }) {
  const presentation = PRESENTATION[status]

  return (
    <span className={`inline-flex items-center gap-2 text-xs ${presentation.text}`}>
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${presentation.dot}`} />
      {presentation.label}
    </span>
  )
}

export type { Status as ServiceStatus }
