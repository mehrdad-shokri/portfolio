'use client'

import type {HTMLAttributes} from 'react'
import {Button} from 'components/Button'
import {Icon} from 'components/Icon'
import {Text} from 'components/Text'
import {useTheme} from 'components/ThemeProvider'
import {Transition} from 'components/Transition'
import {useRef, useState} from 'react'
import styles from './Code.module.css'

export const Code = (props: HTMLAttributes<HTMLPreElement>) => {
  const [copied, setCopied] = useState(false)
  const theme = useTheme()
  const elementRef = useRef<HTMLPreElement>(null)
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lang = (props.className as string | undefined)?.split('-')[1]

  const handleCopy = () => {
    clearTimeout(copyTimeout.current)
    if (elementRef.current?.textContent) {
      navigator.clipboard.writeText(elementRef.current.textContent)
    }
    setCopied(true)
    copyTimeout.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.code} data-theme={(theme as Record<string, unknown>).themeId as string}>
      {!!lang && <Text secondary size='s' className={styles.lang}>{lang}</Text>}
      <pre ref={elementRef} {...props} />
      <div className={styles.actions}>
        <Button iconOnly onClick={handleCopy} aria-label='Copy'>
          <span className={styles.copyIcon}>
            <Transition in={!copied}>{visible => <Icon icon='copy' data-visible={visible} />}</Transition>
            <Transition in={copied}>{visible => <Icon icon='check' data-visible={visible} />}</Transition>
          </span>
        </Button>
      </div>
    </div>
  )
}
