'use client'

import type {ElementType, ReactNode, AnchorHTMLAttributes} from 'react'
import RouterLink from 'next/link'
import {forwardRef} from 'react'
import {classes} from 'utils/style'
import styles from './Link.module.css'

const VALID_EXT = ['txt', 'png', 'jpg']

function isAnchor(href?: string): boolean {
  const isValidExtension = VALID_EXT.includes(href?.split('.').pop() ?? '')
  return !!(href?.includes('://') || href?.[0] === '#' || isValidExtension)
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: ElementType
  secondary?: boolean
  className?: string
  href?: string
  children?: ReactNode
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({href, ...rest}, ref) => {
    if (isAnchor(href)) return <LinkContent href={href} ref={ref} {...rest} />
    return (
      <LinkContent
        as={RouterLink}
        href={href}
        scroll={false}
        ref={ref}
        {...rest}
      />
    )
  }
)

interface LinkContentProps extends LinkProps {
  scroll?: boolean
}

export const LinkContent = forwardRef<HTMLAnchorElement, LinkContentProps>(
  (
    {
      as: Component = 'a',
      rel,
      target,
      children,
      secondary,
      className,
      href,
      ...rest
    },
    ref
  ) => {
    const isExternal = href?.includes('://')
    return (
      <Component
        className={classes(styles.link, className)}
        data-secondary={secondary}
        rel={rel ?? (isExternal ? 'noreferrer noopener' : undefined)}
        href={href}
        target={target ?? (isExternal ? '_blank' : undefined)}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)
