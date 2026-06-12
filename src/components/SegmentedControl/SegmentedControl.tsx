'use client'

import type {KeyboardEvent, ReactNode, RefObject} from 'react'
import {VisuallyHidden} from 'components/VisuallyHidden'
import {createContext, useCallback, useContext, useEffect, useId, useRef, useState} from 'react'
import {cssProps} from 'utils/style'
import styles from './SegmentedControl.module.css'

interface SegmentedControlContextValue {
  optionRefs: RefObject<RefObject<HTMLButtonElement | null>[]>
  currentIndex: number
  onChange: (index: number) => void
  registerOption: (ref: RefObject<HTMLButtonElement | null>) => void
  unRegisterOption: (ref: RefObject<HTMLButtonElement | null>) => void
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>({} as SegmentedControlContextValue)

interface SegmentedControlProps {
  children?: ReactNode
  currentIndex: number
  onChange: (index: number) => void
  label: string
  [key: string]: unknown
}

interface Indicator {width?: number; left?: number}

export const SegmentedControl = ({children, currentIndex, onChange, label, ...props}: SegmentedControlProps) => {
  const id = useId()
  const labelId = `${id}segmented-control-label`
  const optionRefs = useRef<RefObject<HTMLButtonElement | null>[]>([])
  const [indicator, setIndicator] = useState<Indicator | undefined>()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const {length} = optionRefs.current
    const prevIndex = (currentIndex - 1 + length) % length
    const nextIndex = (currentIndex + 1) % length
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) { onChange(prevIndex); optionRefs.current[prevIndex]?.current?.focus() }
    else if (['ArrowRight', 'ArrowDown'].includes(event.key)) { onChange(nextIndex); optionRefs.current[nextIndex]?.current?.focus() }
  }

  const registerOption = useCallback((optionRef: RefObject<HTMLButtonElement | null>) => {
    optionRefs.current = [...optionRefs.current, optionRef]
  }, [])

  const unRegisterOption = useCallback((optionRef: RefObject<HTMLButtonElement | null>) => {
    optionRefs.current = optionRefs.current.filter(ref => ref !== optionRef)
  }, [])

  useEffect(() => {
    const currentOption = optionRefs.current[currentIndex]?.current
    if (!currentOption) return
    const resizeObserver = new ResizeObserver(() => {
      const rect = currentOption.getBoundingClientRect()
      setIndicator({width: rect.width, left: currentOption.offsetLeft})
    })
    resizeObserver.observe(currentOption)
    return () => resizeObserver.disconnect()
  }, [currentIndex])

  return (
    <SegmentedControlContext.Provider value={{optionRefs, currentIndex, onChange, registerOption, unRegisterOption}}>
      <div className={styles.container} role='radiogroup' aria-labelledby={labelId} onKeyDown={handleKeyDown} tabIndex={-1} {...props}>
        <VisuallyHidden as='label' id={labelId}>{label}</VisuallyHidden>
        <div className={styles.options}>
          {!!indicator && (
            <div className={styles.indicator} data-last={currentIndex === optionRefs.current.length - 1} style={cssProps(indicator as Record<string, number>)} />
          )}
          {children}
        </div>
      </div>
    </SegmentedControlContext.Provider>
  )
}

export const SegmentedControlOption = ({children, ...props}: {children?: ReactNode; [key: string]: unknown}) => {
  const {optionRefs, currentIndex, onChange, registerOption, unRegisterOption} = useContext(SegmentedControlContext)
  const optionRef = useRef<HTMLButtonElement>(null)
  const index = optionRefs.current.indexOf(optionRef)
  const isSelected = currentIndex === index

  useEffect(() => {
    registerOption(optionRef)
    return () => unRegisterOption(optionRef)
  }, [registerOption, unRegisterOption])

  return (
    <button className={styles.button} tabIndex={isSelected ? 0 : -1} role='radio' aria-checked={isSelected} onClick={() => onChange(index)} ref={optionRef} {...props}>
      {children}
    </button>
  )
}
