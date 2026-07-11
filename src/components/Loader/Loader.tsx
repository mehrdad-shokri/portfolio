'use client'

import type {CSSProperties} from 'react'
import {Text} from 'components/Text'
import {VisuallyHidden} from 'components/VisuallyHidden'
import {useReducedMotion} from 'framer-motion'
import {useHasMounted} from 'hooks'
import {createPortal} from 'react-dom'
import {classes, cssProps} from 'utils/style'
import styles from './Loader.module.css'

interface LoaderProps {
  className?: string
  style?: CSSProperties
  size?: number
  text?: string
  [key: string]: unknown
}

export const Loader = ({
  className,
  style,
  size = 32,
  text = 'Loading...',
  ...rest
}: LoaderProps) => {
  const reduceMotion = useReducedMotion()
  const hasMounted = useHasMounted()

  const screenReaderPortal = hasMounted
    ? createPortal(
        <VisuallyHidden className='loader-announcement' aria-live='assertive'>
          {text}
        </VisuallyHidden>,
        document.getElementById('portal-root')!
      )
    : null

  if (reduceMotion) {
    return (
      <Text
        className={classes(styles.text, className)}
        weight='medium'
        {...rest}
      >
        {text}
        {screenReaderPortal}
      </Text>
    )
  }

  const gapSize = Math.round((size / 3) * 0.2)
  const spanSize = Math.round(size / 3 - gapSize * 2 - 1)

  return (
    <div
      className={classes(styles.loader, className)}
      style={cssProps({size, spanSize, gapSize}, style)}
      {...rest}
    >
      <div className={styles.content}>
        <div className={styles.span} />
        <div className={styles.span} />
        <div className={styles.span} />
      </div>
      {screenReaderPortal}
    </div>
  )
}
