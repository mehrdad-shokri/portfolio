import type {ElementType, ReactNode, CSSProperties} from 'react'
import {classes} from 'utils/style'
import styles from './Text.module.css'

interface TextProps {
  children?: ReactNode
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
  as?: ElementType
  align?: 'auto' | 'start' | 'center' | 'end'
  weight?: 'auto' | 'regular' | 'medium' | 'bold'
  secondary?: boolean
  className?: string
  style?: CSSProperties
  [key: string]: unknown
}

export const Text = ({
  children,
  size = 'm',
  as: Component = 'span',
  align = 'auto',
  weight = 'auto',
  secondary,
  className,
  ...rest
}: TextProps) => (
  <Component
    className={classes(styles.text, className)}
    data-align={align}
    data-size={size}
    data-weight={weight}
    data-secondary={secondary}
    {...rest}
  >
    {children}
  </Component>
)
