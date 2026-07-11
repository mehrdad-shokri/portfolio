'use client'

import {useTheme} from 'components/ThemeProvider'
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
  const {themeId} = useTheme() as {themeId: string}

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

      // On the light theme, composite dark-green rain over a light background
      // (see the `invertRain` branch in public/matrix/…/palettePass). The
      // default dark-theme look is the engine's native additive glow on black.
      if (themeId === 'light') {
        config.invertRain = true
        config.backgroundColor = {space: 'rgb', values: [0.95, 0.95, 0.95]}
        config.glyphColor = {space: 'hsl', values: [0.33, 0.9, 0.22]}
      }

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
  }, [reduceMotion, themeId])

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
