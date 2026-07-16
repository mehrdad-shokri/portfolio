'use client'

import React from 'react'
import truckModel from 'assets/volvo.glb'
import {Loader} from 'components/Loader'
import {deviceModels} from 'components/Model/deviceModels'
import {Section} from 'components/Section'
import {tokens} from 'components/ThemeProvider/theme'
import {Transition} from 'components/Transition'
import {useReducedMotion, useSpring} from 'framer-motion'
import {useInViewport, useWindowSize} from 'hooks'
import {useFps} from 'hooks/useFps'
import {
  createContext,
  memo,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {OrbitControls} from 'three-stdlib'
import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sprite,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'
import {clamp} from 'utils/clamp'
import {classes, media, msToNum, numToPx} from 'utils/style'
import {cleanRenderer, cleanScene, modelLoader, removeLights} from 'utils/three'
import {throttle} from 'utils/throttle'
import styles from './Truck.module.css'

interface LabelData {
  position: number[]
  text?: string
  delay?: number
  hidden?: boolean
  sprite?: Sprite
  element?: HTMLElement
}

interface LabelElement extends LabelData {
  element: HTMLElement
  sprite: Sprite
}

interface TruckSectionData {
  camera: number[]
  labels: string[]
  spin: number
  sectionRef: React.RefObject<HTMLDivElement | null>
}

const nullTarget = {x: 0, y: 0, z: 6}

const interpolatePosition = (
  value: number,
  nextValue: number,
  percent: number
): number => value + percent * (nextValue - value)

const getPositionValues = (section?: {
  camera?: number[]
}): {x: number; y: number; z: number} => {
  if (!section || !section.camera) return nullTarget

  return {
    x: section.camera[0],
    y: section.camera[1],
    z: section.camera[2],
  }
}

const cameraSpringConfig = {
  stiffness: 80,
  damping: 40,
  mass: 2,
  restSpeed: 0.001,
  restDelta: 0.001,
}

interface TruckContextValue {
  registerSection: (section: TruckSectionData) => void
  unregisterSection: (section: TruckSectionData) => void
}
const TruckContext = createContext<TruckContextValue>({
  registerSection: () => {},
  unregisterSection: () => {},
})

export const Truck = ({
  position = [0, 0, 0],
  scale = 1,
  labels = [],
  className,
  children,
}: {
  position?: number[]
  scale?: number
  labels?: LabelData[]
  className?: string
  children?: React.ReactNode
}) => {
  const [loaded, setLoaded] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loaderVisible, setLoaderVisible] = useState(false)
  const sectionRefs = useRef<TruckSectionData[]>([])
  const container = useRef<HTMLDivElement>(null)
  const labelContainer = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<Scene | undefined>(undefined)
  const renderer = useRef<WebGLRenderer | undefined>(undefined)
  const camera = useRef<PerspectiveCamera | undefined>(undefined)
  const clock = useRef<Clock | undefined>(undefined)
  const sceneModel = useRef<Object3D | undefined>(undefined)
  const inViewport = useInViewport(canvas)
  const animationFrame = useRef<number | undefined>(undefined)
  const initCameraPosition = useRef(getPositionValues(sectionRefs.current[0]))
  const labelElements = useRef<LabelElement[]>([])
  const controls = useRef<OrbitControls | undefined>(undefined)
  const contentAdded = useRef<boolean>(false)
  const mounted = useRef<boolean>(false)
  // Turntable spin: current speed eases toward the active section's target.
  const spinSpeed = useRef(0)
  const spinTarget = useRef(0)
  const {width: windowWidth, height: windowHeight} = useWindowSize()
  const reduceMotion = useReducedMotion()
  const cameraXSpring = useSpring(0, cameraSpringConfig)
  const cameraYSpring = useSpring(0, cameraSpringConfig)
  const cameraZSpring = useSpring(0, cameraSpringConfig)
  const {measureFps, isLowFps} = useFps(inViewport)

  const renderFrame = useCallback(() => {
    if (!inViewport) {
      if (animationFrame.current !== undefined)
        cancelAnimationFrame(animationFrame.current)
      return
    }

    animationFrame.current = requestAnimationFrame(renderFrame)
    const delta = clock.current?.getDelta() ?? 0

    // Ease the turntable toward the active section's speed and advance it.
    spinSpeed.current +=
      (spinTarget.current - spinSpeed.current) * Math.min(1, delta * 2)
    if (sceneModel.current) {
      sceneModel.current.rotation.y += spinSpeed.current * delta
    }

    controls.current?.update()
    renderer.current?.render(scene.current!, camera.current!)

    // Render labels
    labelElements.current.forEach(label => {
      const {element, position: labelPosition, sprite} = label
      const vector = new Vector3().fromArray(labelPosition)
      const meshDistance = camera.current!.position.distanceTo(
        sceneModel.current!.position
      )
      const spriteDistance = camera.current!.position.distanceTo(
        sprite.position
      )
      const spriteBehindObject = spriteDistance > meshDistance

      vector.project(camera.current!)
      vector.x = Math.round((0.5 + vector.x / 2) * window.innerWidth)
      vector.y = Math.round((0.5 - vector.y / 2) * window.innerHeight)
      element.style.setProperty('--posX', numToPx(vector.x))
      element.style.setProperty('--posY', numToPx(vector.y))

      if (spriteBehindObject) {
        element.dataset.occluded = 'true'
      } else {
        element.dataset.occluded = 'false'
      }
    })

    measureFps()

    if (isLowFps.current) {
      renderer.current!.setPixelRatio(0.5)
    } else {
      renderer.current!.setPixelRatio(1)
    }
  }, [inViewport, measureFps, isLowFps])

  useEffect(() => {
    mounted.current = true
    const {innerWidth, innerHeight} = window

    renderer.current = new WebGLRenderer({
      canvas: canvas.current!,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    })
    renderer.current!.setPixelRatio(1)
    renderer.current!.outputEncoding = sRGBEncoding
    renderer.current!.physicallyCorrectLights = true

    camera.current = new PerspectiveCamera(
      54,
      innerWidth / innerHeight,
      0.1,
      100
    )
    camera.current!.position.x = initCameraPosition.current.x
    camera.current!.position.y = initCameraPosition.current.y
    camera.current!.position.z = initCameraPosition.current.z
    camera.current.lookAt(0, 0, 0)

    cameraXSpring.set(camera.current!.position.x)
    cameraYSpring.set(camera.current!.position.y)
    cameraZSpring.set(camera.current!.position.z)

    scene.current = new Scene()
    clock.current = new Clock()

    // Match the home-page vitrine lighting so the teal paint reads the same.
    const ambientLight = new AmbientLight(0xffffff, 1.2)
    const keyLight = new DirectionalLight(0xffffff, 1.1)
    const fillLight = new DirectionalLight(0xffffff, 0.8)
    keyLight.position.set(-2.5, 2.5, 4.5)
    fillLight.position.set(-6, 2, 2)
    const lights = [ambientLight, keyLight, fillLight]
    lights.forEach(light => scene.current!.add(light))

    controls.current = new OrbitControls(
      camera.current,
      canvas.current ?? undefined
    )
    controls.current!.enableZoom = false
    controls.current!.enablePan = false
    controls.current!.enableDamping = false
    controls.current!.rotateSpeed = 0.5

    return () => {
      mounted.current = false
      if (animationFrame.current !== undefined)
        cancelAnimationFrame(animationFrame.current)

      removeLights(lights)
      if (scene.current) cleanScene(scene.current)
      if (renderer.current) cleanRenderer(renderer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleControlStart = () => {
      setGrabbing(true)
      cameraXSpring.stop()
      cameraYSpring.stop()
      cameraZSpring.stop()
    }

    const handleControlEnd = () => {
      cameraXSpring.set(camera.current!.position.x)
      cameraYSpring.set(camera.current!.position.y)
      cameraZSpring.set(camera.current!.position.z)
      setGrabbing(false)
    }

    controls.current?.addEventListener('start', handleControlStart)
    controls.current?.addEventListener('end', handleControlEnd)

    return () => {
      controls.current?.removeEventListener('start', handleControlStart)
      controls.current?.removeEventListener('end', handleControlEnd)
    }
  }, [cameraXSpring, cameraYSpring, cameraZSpring])

  useEffect(() => {
    if (!loaded) return

    const handleCameraChange = (axis: 'x' | 'y' | 'z', value: number) => {
      camera.current!.position[axis] = value
    }

    const unsubscribeCameraX = cameraXSpring.on('change', value =>
      handleCameraChange('x', value)
    )
    const unsubscribeCameraY = cameraYSpring.on('change', value =>
      handleCameraChange('y', value)
    )
    const unsubscribeCameraZ = cameraZSpring.on('change', value =>
      handleCameraChange('z', value)
    )

    return () => {
      unsubscribeCameraX()
      unsubscribeCameraY()
      unsubscribeCameraZ()
    }
  }, [cameraXSpring, cameraYSpring, cameraZSpring, loaded])

  useEffect(() => {
    if (windowWidth <= media.tablet) {
      controls.current!.enabled = false
    }
  }, [windowWidth])

  useEffect(() => {
    if (loaded) return

    const loadModel = async () => {
      const gltf = await modelLoader.loadAsync(truckModel)

      sceneModel.current = gltf.scene

      // Base orientation (face the camera) and the teal paint overrides
      // shared with the home-page vitrine.
      sceneModel.current.rotation.y = Math.PI
      const overrides = deviceModels.volvoTruck.materialOverrides ?? {}

      sceneModel.current.traverse(child => {
        const material = (child as Mesh).material as
          | MeshStandardMaterial
          | undefined
        if (!material) return

        const paint = overrides[material.name]
        if (paint) {
          if (paint.color) {
            material.color = new Color(paint.color)
            material.color.convertSRGBToLinear()
          }
          if (paint.metalness != null) material.metalness = paint.metalness
          if (paint.roughness != null) material.roughness = paint.roughness
        }
      })

      sceneModel.current!.position.x = position[0]
      sceneModel.current!.position.y = position[1]
      sceneModel.current!.position.z = position[2]

      sceneModel.current.scale.setScalar(scale)
    }

    const handleLoad = async () => {
      await loadModel()

      if (mounted.current) {
        setLoaded(true)
      }
    }

    startTransition(() => {
      handleLoad()

      setTimeout(() => {
        setLoaderVisible(true)
      }, 1000)
    })
  }, [loaded, position, scale])

  useEffect(() => {
    // Add the model once loaded
    if (loaded && !contentAdded.current) {
      if (scene.current && sceneModel.current)
        scene.current.add(sceneModel.current)
      contentAdded.current = true
    }

    // Only animate while visible
    if (loaded && inViewport) {
      setVisible(true)
      renderFrame()
    }

    return () => {
      if (animationFrame.current !== undefined)
        cancelAnimationFrame(animationFrame.current)
    }
  }, [renderFrame, inViewport, loaded])

  useEffect(() => {
    if (loaded) {
      if (!labelContainer.current) return
      labelContainer.current.innerHTML = ''
      labelElements.current = labels.map(label => {
        const element = document.createElement('div')
        element.classList.add(styles.label)
        element.dataset.hidden = 'true'
        element.style.setProperty('--delay', `${label.delay || 0}ms`)
        element.textContent = label.text ?? ''
        labelContainer.current!.appendChild(element)
        const sprite = new Sprite()
        sprite.position.fromArray(label.position)
        sprite.scale.set(60, 60, 1)
        return {...label, element, sprite}
      })
    }
  }, [labels, loaded])

  useEffect(() => {
    renderer.current!.setSize(windowWidth, windowHeight)
    camera.current!.aspect = windowWidth / windowHeight
    camera.current!.updateProjectionMatrix()
  }, [windowWidth, windowHeight])

  const handleScroll = useCallback(() => {
    if (!container.current) return

    const {offsetTop} = container.current
    const {innerHeight} = window

    const currentScrollY = window.scrollY - offsetTop
    let prevTarget: {x: number; y: number; z: number} | undefined

    const updateLabels = (index: number) => {
      labelElements.current.forEach(label => {
        if (label.hidden) {
          label.element.dataset.hidden = 'true'
          label.element.setAttribute('aria-hidden', 'true')
        }
      })

      const sectionLabels = sectionRefs.current[index].labels

      sectionLabels.forEach((label: string) => {
        const matches = labelElements.current.filter(
          item => item.text === label
        )
        matches.forEach(match => {
          match.element.dataset.hidden = 'false'
          match.element.setAttribute('aria-hidden', 'false')
        })
      })
    }

    const updateSpin = (index: number) => {
      spinTarget.current = reduceMotion ? 0 : sectionRefs.current[index].spin
    }

    const update = () => {
      const sectionCount = sectionRefs.current.length - 1
      const absoluteSection = Math.floor(currentScrollY / innerHeight)
      const currentSectionIndex = clamp(absoluteSection, 0, sectionCount)
      const currentSection = sectionRefs.current[currentSectionIndex]
      const nextSection = sectionRefs.current[currentSectionIndex + 1]

      const currentTarget = getPositionValues(currentSection) || nullTarget
      const nextTarget = getPositionValues(nextSection) || nullTarget
      const sectionScrolled =
        (currentScrollY - innerHeight * currentSectionIndex) / innerHeight

      const scrollPercent = clamp(sectionScrolled, 0, 1)
      const currentX = interpolatePosition(
        currentTarget.x,
        nextTarget.x,
        scrollPercent
      )
      const currentY = interpolatePosition(
        currentTarget.y,
        nextTarget.y,
        scrollPercent
      )
      const currentZ = interpolatePosition(
        currentTarget.z,
        nextTarget.z,
        scrollPercent
      )

      if (
        prevTarget !== currentTarget &&
        sectionRefs.current.length &&
        currentSection
      ) {
        updateLabels(currentSectionIndex)
        updateSpin(currentSectionIndex)
      }

      prevTarget = currentTarget

      if (grabbing) return

      if (reduceMotion) {
        camera.current!.position.set(currentX, currentY, currentZ)
        return
      }

      cameraXSpring.set(currentX)
      cameraYSpring.set(currentY)
      cameraZSpring.set(currentZ)
    }

    requestAnimationFrame(update)
  }, [cameraXSpring, cameraYSpring, cameraZSpring, grabbing, reduceMotion])

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100)

    if (loaded && inViewport) {
      window.addEventListener('scroll', throttledScroll)
      // Sync camera/labels/spin to the current scroll position immediately.
      throttledScroll()
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [handleScroll, inViewport, loaded])

  const registerSection = useCallback((section: TruckSectionData): void => {
    sectionRefs.current = [...sectionRefs.current, section]
  }, [])

  const unregisterSection = useCallback((section: TruckSectionData): void => {
    sectionRefs.current = sectionRefs.current.filter(item => item !== section)
  }, [])

  return (
    <TruckContext.Provider value={{registerSection, unregisterSection}}>
      <div className={classes(styles.truck, className)} ref={container}>
        <div className={styles.viewport}>
          <canvas
            className={styles.canvas}
            data-visible={loaded && visible}
            data-grabbing={grabbing}
            ref={canvas}
          />
          <div
            className={styles.labels}
            aria-live='polite'
            ref={labelContainer}
          />
          <div className={styles.vignette} />
        </div>
        <div className={styles.sections}>{children}</div>
        <Transition
          unmount
          in={!loaded && loaderVisible}
          timeout={msToNum(tokens.base.durationL)}
        >
          {visible => (
            <Section className={styles.loader} data-visible={visible}>
              <Loader />
            </Section>
          )}
        </Transition>
      </div>
    </TruckContext.Provider>
  )
}

export const TruckSection = memo(
  ({
    children,
    scrim,
    scrimReverse,
    className,
    camera = [0, 0, 6],
    labels = [],
    spin = 0,
  }: {
    children?: React.ReactNode
    scrim?: boolean
    scrimReverse?: boolean
    className?: string
    camera?: number[]
    labels?: string[]
    spin?: number
  }) => {
    const {registerSection, unregisterSection} = useContext(TruckContext)
    const sectionRef = useRef<HTMLDivElement>(null)
    const stringifiedDeps =
      JSON.stringify(camera) + JSON.stringify(labels) + JSON.stringify(spin)

    useEffect(() => {
      const section = {
        camera,
        labels,
        spin,
        sectionRef,
      }

      registerSection(section)

      return () => {
        unregisterSection(section)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stringifiedDeps, registerSection, unregisterSection])

    return (
      <div
        className={classes(styles.section, className)}
        data-scrim={scrim}
        data-scrim-reverse={scrimReverse}
        ref={sectionRef}
      >
        {children}
      </div>
    )
  }
)

TruckSection.displayName = 'TruckSection'
