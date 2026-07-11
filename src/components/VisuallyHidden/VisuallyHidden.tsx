import type {ElementType, ReactNode} from 'react'
import {forwardRef} from 'react'
import {classes} from 'utils/style'
import styles from './VisuallyHidden.module.css'

interface VisuallyHiddenProps {
  className?: string
  showOnFocus?: boolean
  as?: ElementType
  children?: ReactNode
  visible?: boolean
  [key: string]: unknown
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  (
    {
      className,
      showOnFocus,
      as: Component = 'span',
      children,
      visible,
      ...rest
    },
    ref
  ) => {
    const Tag = Component as ElementType
    return (
      <Tag
        className={classes(styles.hidden, className as string)}
        data-hidden={!visible && !showOnFocus}
        data-show-on-focus={showOnFocus}
        ref={ref}
        {...rest}
      >
        {children}
      </Tag>
    )
  }
)
