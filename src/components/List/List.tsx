import type {ReactNode} from 'react'
import {classes} from 'utils/style'
import styles from './List.module.css'

interface ListProps {
  ordered?: boolean
  children?: ReactNode
  className?: string
  [key: string]: unknown
}

export const List = ({ordered, children, className, ...rest}: ListProps) => {
  const Element = (ordered ? 'ol' : 'ul') as 'ol' | 'ul'
  return (
    <Element className={classes(styles.list, className)} {...rest}>
      {children}
    </Element>
  )
}

export const ListItem = ({
  children,
  ...rest
}: {
  children?: ReactNode
  [key: string]: unknown
}) => (
  <li className={styles.item} {...rest}>
    {children}
  </li>
)
