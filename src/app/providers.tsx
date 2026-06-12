'use client'

import type {ReactNode} from 'react'
import type {AppState, AppAction} from 'layouts/App/reducer'
import {Fragment, createContext, useEffect, useReducer} from 'react'
import {Navbar} from 'components/Navbar'
import {ThemeProvider} from 'components/ThemeProvider'
import {useLocalStorage} from 'hooks'
import styles from 'layouts/App/App.module.css'
import {initialState, reducer} from 'layouts/App/reducer'

export interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>
}

export const AppContext = createContext<AppContextValue>({...initialState, dispatch: () => {}})

const repoPrompt = `
  /\\ /\\n /  \\  \\n//  \\\\  \\/\\
\n\nLike what you see? Check out the source code: https://github.com/mehrdad-shokri/portfolio
`

export function Providers({children}: {children: ReactNode}) {
  const [storedTheme] = useLocalStorage<string>('theme',
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : 'dark'
  )
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => { console.info(`${repoPrompt}\n\n`) }, [])
  useEffect(() => {
    const safeTheme = storedTheme === 'light' ? 'light' : 'dark'
    dispatch({type: 'setTheme', value: safeTheme})
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
