import {useEffect, useRef, useState} from 'react'

export function useInViewport(
  elementRef: React.RefObject<Element | null>,
  unobserveOnIntersect?: boolean,
  options: IntersectionObserverInit = {},
  shouldObserve = true
): boolean {
  const [intersect, setIntersect] = useState(false)
  const [isUnobserved, setIsUnobserved] = useState(false)
  const optionsRef = useRef(options)

  useEffect(() => {
    if (!elementRef?.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIntersect(entry.isIntersecting)
      if (entry.isIntersecting && unobserveOnIntersect) {
        observer.unobserve(entry.target)
        setIsUnobserved(true)
      }
    }, optionsRef.current)

    if (!isUnobserved && shouldObserve) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [elementRef, unobserveOnIntersect, isUnobserved, shouldObserve])

  return intersect
}
