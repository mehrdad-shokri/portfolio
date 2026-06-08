'use client'

import {Fragment, createContext, useEffect, useReducer} from 'react'
import {Navbar} from 'components/Navbar'
import {ThemeProvider} from 'components/ThemeProvider'
import {tokens} from 'components/ThemeProvider/theme'
import {AnimatePresence, LazyMotion, domAnimation, m} from 'framer-motion'
import {useFoucFix, useLocalStorage} from 'hooks'
import styles from 'layouts/App/App.module.css'
import {initialState, reducer} from 'layouts/App/reducer'
import {usePathname} from 'next/navigation'
import {msToNum} from 'utils/style'
import {ScrollRestore} from 'layouts/App/ScrollRestore'

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
  const rawPathname = usePathname()
  const pathname = rawPathname.endsWith('/') ? rawPathname : `${rawPathname}/`

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
        <LazyMotion features={domAnimation}>
          <Fragment>
            <Navbar />
            <main className={styles.app} tabIndex={-1} id='MainContent'>
              <AnimatePresence mode='wait'>
                <m.div
                  key={pathname}
                  className={styles.page}
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{
                    type: 'tween',
                    ease: 'linear',
                    duration: msToNum(tokens.base.durationS) / 1000,
                    delay: 0.1,
                  }}
                >
                  <ScrollRestore />
                  {children}
                </m.div>
              </AnimatePresence>
            </main>
          </Fragment>
        </LazyMotion>
      </ThemeProvider>
    </AppContext.Provider>
  )
}
