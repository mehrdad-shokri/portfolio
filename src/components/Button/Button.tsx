'use client'

import type {ElementType, ReactNode} from 'react'
import React from 'react'
import {Icon} from 'components/Icon'
import type {IconType} from 'components/Icon'
import {Loader} from 'components/Loader'
import {Transition} from 'components/Transition'
import RouterLink from 'next/link'
import {forwardRef} from 'react'
import {classes} from 'utils/style'
import styles from './Button.module.css'

function isExternalLink(href?: string): boolean {
  return !!href?.includes('://')
}

export interface ButtonProps {
  href?: string
  as?: ElementType
  secondary?: boolean
  loading?: boolean
  loadingText?: string
  icon?: IconType
  iconEnd?: IconType
  iconHoverShift?: boolean
  iconOnly?: boolean
  children?: ReactNode
  className?: string
  disabled?: boolean
  rel?: string
  target?: string
  onClick?: React.MouseEventHandler
  style?: React.CSSProperties
  [key: string]: unknown
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
  ({href, ...rest}, ref) => {
    if (isExternalLink(href as string) || !href)
      return <ButtonContent href={href as string} ref={ref} {...rest} />
    return (
      <ButtonContent
        as={RouterLink}
        href={href as string}
        scroll={false}
        ref={ref}
        {...rest}
      />
    )
  }
)

const ButtonContent = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = 'loading',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href as string | undefined)
    const Component = (as ?? (href ? 'a' : 'button')) as ElementType

    return (
      <Component
        className={classes(styles.button, className as string)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        data-icon={icon}
        href={href as string | undefined}
        rel={
          (rel ?? (isExternal ? 'noopener noreferrer' : undefined)) as
            | string
            | undefined
        }
        target={
          (target ?? (isExternal ? '_blank' : undefined)) as string | undefined
        }
        disabled={disabled as boolean | undefined}
        ref={ref}
        {...rest}
      >
        {!!icon && (
          <Icon
            className={styles.icon}
            data-start={!iconOnly}
            data-shift={iconHoverShift}
            icon={icon as IconType}
          />
        )}
        {!!children && (
          <span className={styles.text}>{children as React.ReactNode}</span>
        )}
        {!!iconEnd && (
          <Icon
            className={styles.icon}
            data-end={!iconOnly}
            data-shift={iconHoverShift}
            icon={iconEnd as IconType}
          />
        )}
        <Transition unmount in={loading as boolean}>
          {visible => (
            <Loader
              className={styles.loader}
              style={{}}
              size={32}
              text={loadingText as string}
              data-visible={visible}
            />
          )}
        </Transition>
      </Component>
    )
  }
)
