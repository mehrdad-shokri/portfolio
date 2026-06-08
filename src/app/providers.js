'use client'

import {Fragment, createContext, useEffect, useReducer} from 'react'
import {Navbar} from 'components/Navbar'
import {ThemeProvider} from 'components/ThemeProvider'
import {useFoucFix, useLocalStorage} from 'hooks'
import styles from 'layouts/App/App.module.css'
import {initialState, reducer} from 'layouts/App/reducer'

export const AppContext = createContext({})

const repoPrompt = `
  /\ /\\n /  \  \\n//  \\  \/\
\n\nLike what you see? Check out the source code: https://github.com/mehrdad-shokri/portfolio
`

export function Providers({children}) {
  const [storedTheme] = useLocalStorage(
    'theme',
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'dark'
  )
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(`${repoPrompt}\n\n`)
  }, [])

  useEffect(() => {
    dispatch({type: 'setTheme', value: storedTheme || 'dark'})
  }, [storedTheme])

  return (
    <AppContext.Provider value={{...state, dispatch}}>
      <ThemeProvider themeId={state.theme}>
        <Fragment>
          <Navbar />
          <main className={styles.app} tabIndex={-1} id='MainContent'>
            {children}
          </main>
        </Fragment>
      </ThemeProvider>
    </AppContext.Provider>
  )
}
