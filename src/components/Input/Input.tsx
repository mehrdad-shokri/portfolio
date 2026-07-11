'use client'

import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
} from 'react'
import {Icon} from 'components/Icon'
import {tokens} from 'components/ThemeProvider/theme'
import {Transition} from 'components/Transition'
import {useId, useRef, useState} from 'react'
import {classes, cssProps, msToNum} from 'utils/style'
import styles from './Input.module.css'
import {TextArea} from './TextArea'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  value?: string
  multiline?: boolean
  className?: string
  style?: CSSProperties
  error?: string | null
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

export const Input = ({
  id,
  label,
  value,
  multiline,
  className,
  style,
  error,
  onBlur,
  autoComplete,
  required,
  maxLength,
  type,
  onChange,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false)
  const generatedId = useId()
  const errorRef = useRef<HTMLDivElement>(null)
  const inputId = id ?? `${generatedId}input`
  const labelId = `${inputId}-label`
  const errorId = `${inputId}-error`
  const InputElement = multiline ? TextArea : 'input'

  return (
    <div
      className={classes(styles.container, className)}
      data-error={!!error}
      style={style}
      {...(rest as object)}
    >
      <div className={styles.content}>
        <label
          className={styles.label}
          data-focused={focused}
          data-filled={!!value}
          id={labelId}
          htmlFor={inputId}
        >
          {label}
        </label>
        <InputElement
          className={styles.input}
          id={inputId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={event => {
            setFocused(false)
            onBlur?.(
              event as FocusEvent<HTMLInputElement | HTMLTextAreaElement>
            )
          }}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          type={type}
        />
        <div className={styles.underline} data-focused={focused} />
      </div>
      <Transition unmount in={!!error} timeout={msToNum(tokens.base.durationM)}>
        {visible => (
          <div
            className={styles.error}
            data-visible={visible}
            id={errorId}
            role='alert'
            style={cssProps({
              height: visible
                ? (errorRef.current?.getBoundingClientRect().height ?? 0)
                : 0,
            })}
          >
            <div className={styles.errorMessage} ref={errorRef}>
              <Icon icon='error' />
              {error}
            </div>
          </div>
        )}
      </Transition>
    </div>
  )
}
