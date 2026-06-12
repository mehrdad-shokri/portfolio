import type {ElementType, ReactNode} from 'react'
import {Fragment} from 'react'
import {classes} from 'utils/style'
import styles from './Heading.module.css'

interface HeadingProps {
  children?: ReactNode
  level?: number
  as?: ElementType
  align?: 'auto' | 'start' | 'center' | 'end'
  weight?: 'auto' | 'regular' | 'medium' | 'bold'
  className?: string
  id?: string
  [key: string]: unknown
}

export const Heading = ({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className,
  ...rest
}: HeadingProps) => {
  const clampedLevel = Math.min(Math.max(level, 0), 5)
  const Component = (as || `h${Math.max(clampedLevel, 1)}`) as ElementType
  return (
    <Fragment>
      <Component
        className={classes(styles.heading, className)}
        data-align={align}
        data-weight={weight}
        data-level={clampedLevel}
        {...rest}
      >
        {children}
      </Component>
    </Fragment>
  )
}
