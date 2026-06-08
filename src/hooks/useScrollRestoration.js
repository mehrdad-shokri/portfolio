import {useEffect} from 'react'

export function useScrollRestoration() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const target = hash ? document.getElementById(hash) : null

    if (target) {
      window.scrollTo(0, target.offsetTop)
      target.focus({preventScroll: true})
    } else {
      window.scrollTo(0, 0)
    }
  }, [])
}
