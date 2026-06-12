import {useEffect, useRef, useState} from 'react'

export function useInViewport(
  elementRef: React.RefObject<Element | null>,
  unobserveOnIntersect?: boolean,
  options: IntersectionObserverInit = {},
  shouldObserve = true
): boolean {
  const [intersect, setIntersect] = useState(false)
  const [isUnobserved, setIsUnobserved] = useState(false)

  useEffect(() => {
    if (!elementRef?.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIntersect(entry.isIntersecting)
      if (entry.isIntersecting && unobserveOnIntersect) {
        observer.unobserve(entry.target)
        setIsUnobserved(true)
      }
    }, options)

    if (!isUnobserved && shouldObserve) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [elementRef, unobserveOnIntersect, options, isUnobserved, shouldObserve])

  return intersect
}
