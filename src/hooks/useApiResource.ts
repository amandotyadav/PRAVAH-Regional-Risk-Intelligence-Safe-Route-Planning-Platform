import { useCallback, useEffect, useRef, useState } from 'react'
import { toUserMessage } from '../services/errors'

export interface ApiResource<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  reload: () => void
}

/**
 * Loads a backend resource once and exposes loading / error / data for the
 * screen to render. `deps` re-runs the request when the inputs change.
 */
export function useApiResource<T>(
  loader: () => Promise<T>,
  deps: readonly unknown[] = [],
  options: { errorMessage?: string; enabled?: boolean } = {},
): ApiResource<T> {
  const { errorMessage, enabled = true } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  // Kept in a ref so changing the callback identity does not refetch.
  const loaderRef = useRef(loader)
  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let active = true
    setIsLoading(true)
    setError(null)

    loaderRef
      .current()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((cause: unknown) => {
        if (active) setError(toUserMessage(cause, errorMessage))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, enabled, ...deps])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { data, isLoading, error, reload }
}
