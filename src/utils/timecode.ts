export function formatTimecode(time: number): string {
  const hours = time / 1000 / 60 / 60
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  const s = Math.floor(((hours - h) * 60 - m) * 60)
  const c = Math.floor(((((hours - h) * 60 - m) * 60 - s) * 1000) / 10)
  return `${zeroPrefix(h)}:${zeroPrefix(m)}:${zeroPrefix(s)}:${zeroPrefix(c)}`
}

export function zeroPrefix(value: number): string {
  return value < 10 ? `0${value}` : `${value}`
}
