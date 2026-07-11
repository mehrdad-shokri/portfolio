'use client'

import {Transition} from 'components/Transition'
import {useReducedMotion} from 'framer-motion'
import {useEffect, useRef} from 'react'
import styles from './MatrixRain.module.css'

interface MatrixRainProps {
  [key: string]: unknown
}

/**
 * Digital-rain background based on Rezmason/matrix (3D "volumetric" mode).
 *
 * The engine is a self-contained WebGL (regl) app vendored under
 * `public/matrix/`. It's loaded here as native ES modules at runtime via
 * `import(/* webpackIgnore *\/ ...)` so webpack doesn't try to bundle it and
 * the engine's own relative imports + asset fetches resolve against
 * `/matrix/…`. See the PORT PATCH notes in `public/matrix/js/regl/`.
 */
export const MatrixRain = (props: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let teardown: (() => void) | undefined
    let cancelled = false

    const start = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Specifiers are held in variables so TS/webpack don't try to resolve
      // or bundle them; `webpackIgnore` leaves them as native runtime imports.
      const configUrl = '/matrix/js/config.js'
      const rainUrl = '/matrix/js/regl/main.js'
      const {default: makeConfig} = await import(
        /* webpackIgnore: true */ configUrl
      )
      const {default: makeRain} = await import(
        /* webpackIgnore: true */ rainUrl
      )

      if (cancelled) return

      const config = makeConfig({
        version: '3d',
        // Draw a single static frame instead of animating when the visitor
        // prefers reduced motion.
        ...(reduceMotion ? {once: 'true'} : {}),
      })

      teardown = await makeRain(canvas, config)

      // Unmounted while the engine was still booting — tear it down now.
      if (cancelled) {
        teardown?.()
        teardown = undefined
      }
    }

    start()

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [reduceMotion])

  return (
    <Transition in timeout={3000}>
      {visible => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  )
}
