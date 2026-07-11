export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  timeFrame: number
) {
  let lastTime = 0

  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}
