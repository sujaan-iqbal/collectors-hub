import { useCallback, useEffect, useState } from 'react'
import type { LoadState } from '@/types'

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [state, setState] = useState<LoadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  const load = useCallback(() => {
    let cancelled = false
    setState('loading')
    setError(null)
    fetcher()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setState('success')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setState('error')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])

  return { data, state, error, retry }
}
