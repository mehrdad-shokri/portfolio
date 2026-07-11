import {useEffect, useRef} from 'react'

export function useInterval(
  callback: () => void,
  delay: number | null,
  reset?: unknown
): void {
  const savedCallback = useRef<() => void>(() => {})

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay, reset])
}
