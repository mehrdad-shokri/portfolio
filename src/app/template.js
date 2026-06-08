'use client'

import {m, LazyMotion, domAnimation} from 'framer-motion'
import {useScrollRestoration} from 'hooks'
import {tokens} from 'components/ThemeProvider/theme'
import {msToNum} from 'utils/style'
import styles from 'layouts/App/App.module.css'

export default function Template({children}) {
  useScrollRestoration()

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={styles.page}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: msToNum(tokens.base.durationS) / 1000,
          delay: 0.1,
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
