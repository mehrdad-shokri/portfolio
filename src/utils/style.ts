import type {CSSProperties} from 'react'

export const media = {
  desktop: 2080,
  laptop: 1680,
  tablet: 1040,
  mobile: 696,
  mobileS: 400,
} as const

export type MediaBreakpoint = keyof typeof media

export const pxToNum = (px: string): number => Number(px.replace('px', ''))
export const numToPx = (num: number): string => `${num}px`
export const pxToRem = (px: number): string => `${px / 16}rem`
export const msToNum = (msString: string): number =>
  Number(msString.replace('ms', ''))
export const numToMs = (num: number): string => `${num}ms`

export const rgbToThreeColor = (rgb?: string): number[] =>
  rgb?.split(' ').map(value => Number(value) / 255) ?? []

export function cssProps(
  props: Record<string, string | number>,
  style: CSSProperties = {}
): CSSProperties {
  let result: Record<string, string | number> = {}

  for (const key of Object.keys(props)) {
    let value = props[key]
    if (typeof value === 'number' && key === 'delay') value = numToMs(value)
    if (typeof value === 'number' && key !== 'opacity') value = numToPx(value)
    result[`--${key}`] = value
  }

  return {...result, ...style} as CSSProperties
}

export function classes(
  ...classNames: (string | undefined | null | false)[]
): string {
  return classNames.filter(Boolean).join(' ')
}
