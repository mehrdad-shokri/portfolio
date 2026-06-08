'use client'

import {useHasMounted} from 'hooks'
import {createContext, useEffect} from 'react'
import {classes} from 'utils/style'
import {theme} from './theme'
import {useTheme} from './useTheme'
import {createThemeProperties, createThemeStyleObject, createMediaTokenProperties, squish} from './styles'

export {tokenStyles, fontStyles, squish, createThemeProperties, createThemeStyleObject, createMediaTokenProperties} from './styles'

export const ThemeContext = createContext({})

export const ThemeProvider = ({
  themeId = 'dark',
  theme: themeOverrides,
  children,
  className,
  as: Component = 'div',
  ...rest
}) => {
  const currentTheme = {...theme[themeId], ...themeOverrides}
  const parentTheme = useTheme()
  const isRootProvider = !parentTheme.themeId
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (isRootProvider && hasMounted) {
      window.localStorage.setItem('theme', JSON.stringify(themeId))
      document.body.dataset.theme = themeId
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', `rgb(${currentTheme.rgbBackground})`)
      }
    }
  }, [themeId, isRootProvider, hasMounted, currentTheme.rgbBackground])

  return (
    <ThemeContext.Provider value={currentTheme}>
      {isRootProvider && children}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component
          className={classes('theme-provider', className)}
          data-theme={themeId}
          {...rest}
        >
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  )
}

