'use client'

import type {ChangeEvent, CSSProperties, TextareaHTMLAttributes} from 'react'
import {useEffect, useRef, useState} from 'react'
import {classes, cssProps} from 'utils/style'
import styles from './TextArea.module.css'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  resize?: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  minRows?: number
  maxRows?: number
}

interface TextareaDimensions {
  lineHeight: number
  paddingHeight: number
}

export const TextArea = ({
  className,
  resize = 'none',
  value,
  onChange,
  minRows = 1,
  maxRows,
  ...rest
}: TextAreaProps) => {
  const [rows, setRows] = useState(minRows)
  const [textareaDimensions, setTextareaDimensions] = useState<
    TextareaDimensions | undefined
  >()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!textareaRef.current) return
    const style = getComputedStyle(textareaRef.current)
    setTextareaDimensions({
      lineHeight: parseInt(style.lineHeight, 10),
      paddingHeight:
        parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10),
    })
  }, [])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event)
    if (!textareaDimensions) return
    const {lineHeight, paddingHeight} = textareaDimensions
    const previousRows = event.target.rows
    event.target.rows = minRows
    const currentRows = ~~(
      (event.target.scrollHeight - paddingHeight) /
      lineHeight
    )
    if (currentRows === previousRows) event.target.rows = currentRows
    if (maxRows && currentRows >= maxRows) {
      event.target.rows = maxRows
      event.target.scrollTop = event.target.scrollHeight
    }
    setRows(maxRows && currentRows > maxRows ? maxRows : currentRows)
  }

  return (
    <textarea
      className={classes(styles.textarea, className)}
      ref={textareaRef}
      onChange={handleChange}
      style={cssProps({resize}) as CSSProperties}
      rows={rows}
      value={value}
      {...rest}
    />
  )
}
