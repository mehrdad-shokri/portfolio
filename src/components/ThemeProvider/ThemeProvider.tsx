'use client'

import type {ElementType, ReactNode} from 'react'
import {useHasMounted} from 'hooks'
import {createContext, useEffect} from 'react'
import {classes} from 'utils/style'
import {theme} from './theme'
import {useTheme} from './useTheme'

export {tokenStyles, fontStyles, squish, createThemeProperties, createThemeStyleObject, createMediaTokenProperties} from './styles'

export type ThemeId = 'dark' | 'light'
export type ThemeContextValue = Record<string, string | number>

export const ThemeContext = createContext<ThemeContextValue>({})

interface ThemeProviderProps {
  themeId?: ThemeId
  theme?: Partial<ThemeContextValue>
  children?: ReactNode
  className?: string
  as?: ElementType
  [key: string]: unknown
}

export const ThemeProvider = ({
  themeId = 'dark',
  theme: themeOverrides,
  children,
  className,
  as: Component = 'div',
  ...rest
}: ThemeProviderProps) => {
  const currentTheme = {...theme[themeId], ...themeOverrides} as ThemeContextValue
  const parentTheme = useTheme()
  const isRootProvider = !parentTheme.themeId
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (isRootProvider && hasMounted) {
      window.localStorage.setItem('theme', JSON.stringify(themeId))
      document.body.dataset.theme = themeId
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      metaThemeColor?.setAttribute('content', `rgb(${currentTheme.rgbBackground})`)
    }
  }, [themeId, isRootProvider, hasMounted, currentTheme.rgbBackground])

  return (
    <ThemeContext.Provider value={currentTheme}>
      {isRootProvider && children}
      {!isRootProvider && (
        <Component className={classes('theme-provider', className)} data-theme={themeId} {...rest}>
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  )
}
