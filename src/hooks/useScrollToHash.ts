import {useReducedMotion} from 'framer-motion'
import {useRouter, usePathname} from 'next/navigation'
import {useCallback, useRef} from 'react'

export function useScrollToHash() {
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  const scrollToHash = useCallback(
    (hash: string, onDone?: () => void) => {
      const id = hash.split('#')[1]
      const targetElement = document.getElementById(id)
      const newPath = `${pathname}#${id}`

      targetElement?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'})

      const handleScroll = () => {
        clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll)
          if (window.location.pathname === pathname) {
            onDone?.()
            router.push(newPath, {scroll: false})
          }
        }, 50)
      }

      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
        clearTimeout(scrollTimeout.current)
      }
    },
    [router, reduceMotion, pathname]
  )

  return scrollToHash
}
