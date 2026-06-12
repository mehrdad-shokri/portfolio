import type {ElementType, ReactNode} from 'react'
import {forwardRef} from 'react'
import {classes} from 'utils/style'
import styles from './Section.module.css'

interface SectionProps {
  as?: ElementType
  children?: ReactNode
  className?: string
  [key: string]: unknown
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({as: Component = 'div', children, className, ...rest}, ref) => {
    const Tag = Component as ElementType
    return (
      <Tag className={classes(styles.section, className as string)} ref={ref} {...rest}>
        {children}
      </Tag>
    )
  }
)
