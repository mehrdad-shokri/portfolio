import {Fragment, createContext, useEffect, useReducer} from 'react'
import {Navbar} from 'components/Navbar'
import {ThemeProvider} from 'components/ThemeProvider'
import {tokens} from 'components/ThemeProvider/theme'
import {AnimatePresence, LazyMotion, domAnimation, m} from 'framer-motion'
import {useFoucFix, useLocalStorage} from 'hooks'
import styles from 'layouts/App/App.module.css'
import {initialState, reducer} from 'layouts/App/reducer'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {msToNum} from 'utils/style'
import {ScrollRestore} from '../layouts/App/ScrollRestore'
import 'layouts/App/reset.css'
import 'layouts/App/global.css'
export const AppContext = createContext({})

const repoPrompt = `
  \u002f\u005c \u002f\u005c\n \u002f  \u005c  \u005c\n\u002f\u002f  \u005c\u005c  \u005c\u002f\u005c
\n\nLike what you see? Check out the source code: https://github.com/mehrdad-shokri/portfolio
`

const App = ({Component, pageProps}) => {
  const [storedTheme] = useLocalStorage(
    'theme',
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'dark'
  )
  const [state, dispatch] = useReducer(reducer, initialState)
  const {route, events, asPath} = useRouter()
  const canonicalRoute = route === '/' ? '' : `${asPath}`
  useFoucFix()

  // Handle analytics pageview recording
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return

    // Fathom.load(process.env.NEXT_PUBLIC_FATHOM_ID, {
    //   url: process.env.NEXT_PUBLIC_FATHOM_URL,
    // })

    const onRouteChangeComplete = () => {
      // Fathom.trackPageview({url: window.location.pathname})
    }
    const onRouteChangeStart = () => {
      // Fathom.trackPageview({url: window.location.pathname})
    }
    const onRouteChangeError = () => {
      // Fathom.trackPageview({url: window.location.pathname})
    }

    // Record a pageview when route changes
    events.on('routeChangeComplete', onRouteChangeComplete)
    events.on('routeChangeStart', onRouteChangeStart)
    events.on('routeChangeError', onRouteChangeError)

    return () => {
      events.off('routeChangeComplete', onRouteChangeComplete)
      events.off('routeChangeStart', onRouteChangeStart)
      events.off('routeChangeError', onRouteChangeError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <Head>
              <link
                rel='canonical'
                href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${canonicalRoute}`}
              />
            </Head>
            <Navbar />
            <main className={styles.app} tabIndex={-1} id='MainContent'>
              <AnimatePresence mode='wait'>
                <m.div
                  key={route}
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
                  <Component {...pageProps} />
                </m.div>
              </AnimatePresence>
            </main>
          </Fragment>
        </LazyMotion>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

export default App
