'use client'

import {useTheme} from 'components/ThemeProvider'
import {Transition} from 'components/Transition'
import {useReducedMotion, useSpring} from 'framer-motion'
import {useInViewport, useWindowSize} from 'hooks'
import {useFps} from 'hooks/useFps'
import {startTransition, useEffect, useRef} from 'react'
import {
  AmbientLight,
  DirectionalLight,
  Light,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  sRGBEncoding,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
} from 'three'
import {media} from 'utils/style'
import {cleanRenderer, cleanScene, removeLights} from 'utils/three'
import styles from './DisplacementSphere.module.css'
import fragShader from './displacementSphereFragment.glsl'
import vertShader from './displacementSphereVertex.glsl'

const springConfig = {
  stiffness: 30,
  damping: 20,
  mass: 2,
}

interface SphereMesh extends Mesh {
  modifier?: number
}

interface DisplacementSphereProps {
  [key: string]: unknown
}

export const DisplacementSphere = (props: DisplacementSphereProps) => {
  const theme = useTheme()
  const {themeId, colorWhite} = theme as {
    themeId: string
    colorWhite: string
  }
  const start = useRef(Date.now())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef<Vector2 | null>(null)
  const renderer = useRef<WebGLRenderer | null>(null)
  const camera = useRef<PerspectiveCamera | null>(null)
  const scene = useRef<Scene | null>(null)
  const lights = useRef<Light[] | null>(null)
  const uniforms = useRef<Record<string, {value: unknown}> | null>(null)
  const material = useRef<MeshPhongMaterial | null>(null)
  const geometry = useRef<SphereGeometry | null>(null)
  const sphere = useRef<SphereMesh | null>(null)
  const reduceMotion = useReducedMotion()
  const isInViewport = useInViewport(canvasRef)
  const windowSize = useWindowSize()
  const rotationX = useSpring(0, springConfig)
  const rotationY = useSpring(0, springConfig)
  const {measureFps, isLowFps} = useFps(isInViewport)

  useEffect(() => {
    const {innerWidth, innerHeight} = window
    mouse.current = new Vector2(0.8, 0.5)
    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current ?? undefined,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    })
    renderer.current.setSize(innerWidth, innerHeight)
    renderer.current.setPixelRatio(1)
    renderer.current.outputEncoding = sRGBEncoding

    camera.current = new PerspectiveCamera(
      54,
      innerWidth / innerHeight,
      0.1,
      100
    )
    camera.current.position.z = 52

    scene.current = new Scene()

    material.current = new MeshPhongMaterial()
    material.current.onBeforeCompile = shader => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        {time: {value: 0}},
      ]) as Record<string, {value: unknown}>

      shader.uniforms = uniforms.current as typeof shader.uniforms
      shader.vertexShader = vertShader
      shader.fragmentShader = fragShader
    }

    startTransition(() => {
      geometry.current = new SphereGeometry(32, 128, 128)
      const mesh: SphereMesh = new Mesh(geometry.current, material.current!)
      mesh.position.z = 0
      mesh.modifier = Math.random()
      sphere.current = mesh
      scene.current!.add(sphere.current)
    })

    return () => {
      cleanScene(scene.current!)
      cleanRenderer(renderer.current!)
    }
  }, [])

  useEffect(() => {
    const dirLight = new DirectionalLight(colorWhite, 0.6)
    const ambientLight = new AmbientLight(
      colorWhite,
      themeId === 'light' ? 0.8 : 0.1
    )

    dirLight.position.z = 200
    dirLight.position.x = 100
    dirLight.position.y = 100

    lights.current = [dirLight, ambientLight]
    // Transparent scene background so the MatrixRain canvas behind it shows
    // through — only the sphere mesh is drawn, letting the rain sit behind it.
    scene.current!.background = null
    lights.current.forEach(light => scene.current!.add(light))

    return () => {
      removeLights(lights.current!)
    }
  }, [colorWhite, themeId])

  useEffect(() => {
    const {width, height} = windowSize

    const adjustedHeight = height + height * 0.3
    renderer.current!.setSize(width, adjustedHeight)
    camera.current!.aspect = width / adjustedHeight
    camera.current!.updateProjectionMatrix()

    // Render a single frame on resize when not animating
    if (reduceMotion) {
      renderer.current!.render(scene.current!, camera.current!)
    }

    if (sphere.current) {
      if (width <= media.mobile) {
        sphere.current.position.x = 14
        sphere.current.position.y = 10
      } else if (width <= media.tablet) {
        sphere.current.position.x = 18
        sphere.current.position.y = 14
      } else {
        sphere.current.position.x = 22
        sphere.current.position.y = 16
      }
    }
  }, [reduceMotion, windowSize])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      }

      rotationX.set(position.y / 2)
      rotationY.set(position.x / 2)
    }

    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isInViewport, reduceMotion, rotationX, rotationY])

  useEffect(() => {
    let animation: number

    const animate = () => {
      animation = requestAnimationFrame(animate)

      if (uniforms.current !== undefined && uniforms.current !== null) {
        uniforms.current.time.value = 0.00005 * (Date.now() - start.current)
      }

      if (sphere.current) {
        sphere.current.rotation.z += 0.001
        sphere.current.rotation.x = rotationX.get()
        sphere.current.rotation.y = rotationY.get()
      }

      renderer.current!.render(scene.current!, camera.current!)

      measureFps()

      if (isLowFps.current) {
        renderer.current!.setPixelRatio(0.5)
      } else {
        renderer.current!.setPixelRatio(1)
      }
    }

    if (!reduceMotion && isInViewport) {
      animate()
    } else {
      renderer.current!.render(scene.current!, camera.current!)
    }

    return () => {
      cancelAnimationFrame(animation)
    }
  }, [isInViewport, measureFps, reduceMotion, isLowFps, rotationX, rotationY])

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
