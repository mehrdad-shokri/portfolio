'use client'

import React from 'react'
import earthModel from 'assets/earth.glb'
import mwnx from 'assets/milkyway-nx.hdr'
import mwny from 'assets/milkyway-ny.hdr'
import mwnz from 'assets/milkyway-nz.hdr'
import mwpx from 'assets/milkyway-px.hdr'
import mwpy from 'assets/milkyway-py.hdr'
import mwpz from 'assets/milkyway-pz.hdr'
import milkywayBg from 'assets/milkyway.jpg'
import {Loader} from 'components/Loader'
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
import {HDRCubeTextureLoader, OrbitControls} from 'three-stdlib'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  Clock,
  CubeTexture,
  DirectionalLight,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Sprite,
  Vector2,
  Vector3,
  WebGLRenderer,
  Object3D,
  Texture,
  sRGBEncoding,
} from 'three'
import {LinearFilter} from 'three'
import {EquirectangularReflectionMapping} from 'three'
import {clamp} from 'utils/clamp'
import {classes, media, msToNum, numToPx} from 'utils/style'
import {
  cleanRenderer,
  cleanScene,
  getChild,
  modelLoader,
  removeLights,
  textureLoader,
} from 'utils/three'
import {throttle} from 'utils/throttle'
import styles from './Earth.module.css'

interface LabelData {
  position: number[]
  content?: string
  text?: string
  delay?: number
  hidden?: boolean
  sprite?: Sprite
  element?: HTMLElement
  [key: string]: unknown
}

interface LabelElement extends LabelData {
  element: HTMLElement
  sprite: Sprite
}

interface EarthSectionData {
  camera: number[]
  animations: string[]
  meshes: string[]
  labels: string[]
  sectionRef: React.RefObject<HTMLDivElement | null>
}

const nullTarget = {x: 0, y: 0, z: 2}

// Scratch vector reused across frames when projecting labels.
const labelVector = new Vector3()

const interpolatePosition = (
  value: number,
  nextValue: number,
  percent: number
): number => value + percent * (nextValue - value)

/*
const positionToString = value =>
  Object.keys(value)
    .map(key => parseFloat(Math.round(value[key] * 100) / 100).toFixed(2))
    .join(', ');
*/

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

const isEqualPosition = (
  position1?: {x?: number; y?: number; z?: number},
  position2?: {x?: number; y?: number; z?: number}
): boolean => {
  const round = (num = 0) => Math.round((num + Number.EPSILON) * 100) / 100

  return (
    round(position1?.x) === round(position2?.x) &&
    round(position1?.y) === round(position2?.y) &&
    round(position1?.z) === round(position2?.z)
  )
}

const cameraSpringConfig = {
  stiffness: 80,
  damping: 40,
  mass: 2,
  restSpeed: 0.001,
  restDelta: 0.001,
}

const chunkSpringConfig = {
  stiffness: 40,
  damping: 30,
  mass: 2,
  restSpeed: 0.001,
  restDelta: 0.001,
}

const opacitySpringConfig = {
  stiffness: 40,
  damping: 30,
}

interface EarthContextValue {
  registerSection: (section: EarthSectionData) => void
  unregisterSection: (section: EarthSectionData) => void
}
const EarthContext = createContext<EarthContextValue>({
  registerSection: () => {},
  unregisterSection: () => {},
})

export const Earth = ({
  position = [0, 0, 0],
  scale = 1,
  hideMeshes = [],
  labels = [],
  className,
  children,
}: {
  position?: number[]
  scale?: number
  hideMeshes?: string[]
  labels?: LabelData[]
  className?: string
  children?: React.ReactNode
  scrim?: boolean
  scrimReverse?: boolean
  camera?: number[]
  animations?: string | string[]
  meshes?: unknown
  [key: string]: unknown
}) => {
  const [loaded, setLoaded] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  // State drives the cursor; the ref gates scroll logic without waiting for
  // a re-render (the release handler re-targets the camera synchronously).
  const grabbingRef = useRef(false)
  // Last section whose meshes/animations/labels were applied; -1 forces the
  // first apply.
  const activeSectionIndex = useRef(-1)
  const [visible, setVisible] = useState(false)
  const [loaderVisible, setLoaderVisible] = useState(false)
  const sectionRefs = useRef<EarthSectionData[]>([])
  const container = useRef<HTMLDivElement>(null)
  const labelContainer = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<Scene | undefined>(undefined)
  const renderer = useRef<WebGLRenderer | undefined>(undefined)
  const camera = useRef<PerspectiveCamera | undefined>(undefined)
  const clock = useRef<Clock | undefined>(undefined)
  const mouse = useRef<Vector2 | undefined>(undefined)
  const raycaster = useRef<Raycaster | undefined>(undefined)
  const sceneModel = useRef<Object3D | undefined>(undefined)
  const animations = useRef<AnimationClip[] | undefined>(undefined)
  const mixer = useRef<AnimationMixer | undefined>(undefined)
  const inViewport = useInViewport(canvas)
  const animationFrame = useRef<number | undefined>(undefined)
  const initCameraPosition = useRef(getPositionValues(sectionRefs.current[0]))
  const labelElements = useRef<LabelElement[]>([])
  const controls = useRef<OrbitControls | undefined>(undefined)
  const envMap = useRef<Texture | undefined>(undefined)
  const contentAdded = useRef<boolean>(false)
  const mounted = useRef<boolean>(false)
  const {width: windowWidth, height: windowHeight} = useWindowSize()
  const reduceMotion = useReducedMotion()
  const cameraXSpring = useSpring(0, cameraSpringConfig)
  const cameraYSpring = useSpring(0, cameraSpringConfig)
  const cameraZSpring = useSpring(0, cameraSpringConfig)
  const chunkXSpring = useSpring(0, chunkSpringConfig)
  const chunkYSpring = useSpring(0, chunkSpringConfig)
  const chunkZSpring = useSpring(0, chunkSpringConfig)
  const opacitySpring = useSpring(0, opacitySpringConfig)
  const {measureFps, isLowFps} = useFps(inViewport)

  const renderFrame = useCallback(() => {
    if (!inViewport) {
      if (animationFrame.current !== undefined)
        cancelAnimationFrame(animationFrame.current)
      return
    }

    animationFrame.current = requestAnimationFrame(renderFrame)
    const delta = clock.current?.getDelta() ?? 0
    mixer.current?.update(delta)
    controls.current?.update()
    renderer.current?.render(scene.current!, camera.current!)

    // Render labels
    labelElements.current.forEach(label => {
      const {element, position, sprite} = label
      labelVector.fromArray(position)
      const meshDistance = camera.current!.position.distanceTo(
        sceneModel.current!.position
      )
      const spriteDistance = camera.current!.position.distanceTo(
        sprite.position
      )
      const spriteBehindObject = spriteDistance > meshDistance
      void spriteBehindObject

      labelVector.project(camera.current!)
      const posX = Math.round((0.5 + labelVector.x / 2) * window.innerWidth)
      const posY = Math.round((0.5 - labelVector.y / 2) * window.innerHeight)
      element.style.setProperty('--posX', numToPx(posX))
      element.style.setProperty('--posY', numToPx(posY))

      if (spriteBehindObject) {
        element.dataset.occluded = 'true'
      } else {
        element.dataset.occluded = 'false'
      }
    })

    measureFps()

    // setPixelRatio resizes the canvas buffer; only touch it on change.
    const targetPixelRatio = isLowFps.current ? 0.5 : 1
    if (renderer.current!.getPixelRatio() !== targetPixelRatio) {
      renderer.current!.setPixelRatio(targetPixelRatio)
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
    renderer.current!.toneMapping = ACESFilmicToneMapping

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
    raycaster.current = new Raycaster()

    const ambientLight = new AmbientLight(0x222222, 0.05)
    const dirLight = new DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(3, 0, 1)
    const lights = [ambientLight, dirLight]
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
      if (renderer.current)
        if (renderer.current) cleanRenderer(renderer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loaded) return

    const chunk = getChild('Chunk', sceneModel.current!)
    const atmosphere = getChild('Atmosphere', sceneModel.current!)

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

    const handleChunkChange = (axis: 'x' | 'y' | 'z', value: number) => {
      if (chunk) {
        chunk.position[axis] = value
      }
    }

    const unsubscribeChunkX = chunkXSpring.on('change', value =>
      handleChunkChange('x', value)
    )
    const unsubscribeChunkY = chunkYSpring.on('change', value =>
      handleChunkChange('y', value)
    )
    const unsubscribeChunkZ = chunkZSpring.on('change', value =>
      handleChunkChange('z', value)
    )

    const unsubscribeOpacity = opacitySpring.on('change', value => {
      if (atmosphere) {
        const material = (atmosphere as Mesh).material as MeshStandardMaterial
        material.opacity = value
      }
    })

    return () => {
      unsubscribeCameraX()
      unsubscribeCameraY()
      unsubscribeCameraZ()
      unsubscribeChunkX()
      unsubscribeChunkY()
      unsubscribeChunkZ()
      unsubscribeOpacity()
    }
  }, [
    cameraXSpring,
    cameraYSpring,
    cameraZSpring,
    chunkXSpring,
    chunkYSpring,
    chunkZSpring,
    loaded,
    opacitySpring,
  ])

  useEffect(() => {
    if (!controls.current) return
    // Dragging competes with scrolling on touch layouts; re-enable when the
    // viewport grows back past the breakpoint.
    controls.current.enabled = windowWidth > media.tablet
  }, [windowWidth])

  useEffect(() => {
    if (loaded) return

    const hdrLoader = new HDRCubeTextureLoader()
    const pmremGenerator = new PMREMGenerator(renderer.current!)
    pmremGenerator.compileCubemapShader()

    const loadModel = async () => {
      const gltf = await modelLoader.loadAsync(earthModel)

      sceneModel.current = gltf.scene
      animations.current = gltf.animations
      mixer.current = new AnimationMixer(sceneModel.current)
      mixer.current.timeScale = 0.1

      sceneModel.current?.traverse(async child => {
        const material = (child as Mesh).material as
          | MeshStandardMaterial
          | undefined
        if (!material) return

        if (child.name === 'Atmosphere') {
          material.alphaMap = material.map
        }

        if (material.map) {
          await renderer.current!.initTexture(material.map)
        }
      })

      sceneModel.current!.position.x = position[0]
      sceneModel.current!.position.y = position[1]
      sceneModel.current!.position.z = position[2]

      sceneModel.current.scale.x = scale
      sceneModel.current.scale.y = scale
      sceneModel.current.scale.z = scale
    }

    const loadEnv = async () => {
      // HDRCubeTextureLoader.load takes the 6 cube faces; three-stdlib mistypes
      // its loadAsync override as single-url, so use the callback form here.
      const hdrTexture = await new Promise<CubeTexture>((resolve, reject) => {
        hdrLoader.load(
          [mwnx, mwny, mwnz, mwpx, mwpy, mwpz],
          resolve,
          undefined,
          reject
        )
      })

      hdrTexture.magFilter = LinearFilter
      const envTexture = pmremGenerator.fromCubemap(hdrTexture).texture
      envMap.current = envTexture
      pmremGenerator.dispose()
      await renderer.current!.initTexture(envTexture)
    }

    const loadBackground = async () => {
      // Despite the *.jpg type declaration, Next resolves image imports to
      // StaticImageData at runtime, so the URL lives on .src.
      const backgroundTexture = await textureLoader.loadAsync(
        (milkywayBg as unknown as {src: string}).src
      )
      backgroundTexture.mapping = EquirectangularReflectionMapping
      backgroundTexture.encoding = sRGBEncoding
      if (scene.current) scene.current.background = backgroundTexture
      await renderer.current!.initTexture(backgroundTexture)
    }

    const handleLoad = async () => {
      await Promise.all([loadBackground(), loadEnv(), loadModel()])

      sceneModel.current!.traverse(child => {
        const material = (child as Mesh).material as
          | MeshStandardMaterial
          | undefined
        if (material) {
          material.envMap = envMap.current ?? null
          material.needsUpdate = true
        }
      })

      if (mounted.current) {
        setLoaded(true)
      }
    }

    let loaderTimer: ReturnType<typeof setTimeout> | undefined

    startTransition(() => {
      handleLoad()

      loaderTimer = setTimeout(() => {
        setLoaderVisible(true)
      }, 1000)
    })

    return () => {
      clearTimeout(loaderTimer)
    }
  }, [loaded, position, scale])

  useEffect(() => {
    // Add models and textures once visible
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

  useEffect(() => {
    const currentCanvas = canvas.current

    // Log readouts for dev in console
    const handleMouseUp = (event: MouseEvent) => {
      const {innerWidth, innerHeight} = window
      // Set a camera position property to help with defining camera angles
      // const _cameraPosition = positionToString(camera.current!.position);

      // Set a surface position to help with defining annotations
      mouse.current = new Vector2(
        (event.clientX / innerWidth) * 2 - 1,
        -(event.clientY / innerHeight) * 2 + 1
      )
      raycaster.current?.setFromCamera(mouse.current!, camera.current!)
      const intersects = raycaster.current?.intersectObjects(
        scene.current?.children ?? [],
        true
      )

      if (intersects && intersects.length > 0) {
        // const _clickPosition = positionToString(intersects[0].point);
      }
    }

    if (!currentCanvas) return

    if (process.env.NODE_ENV === 'development') {
      currentCanvas.addEventListener('click', handleMouseUp)
    }

    return () => {
      currentCanvas.removeEventListener('click', handleMouseUp)
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (!container.current) return

    const {offsetTop} = container.current
    const {innerHeight} = window

    const currentScrollY = window.scrollY - offsetTop
    // Sections register from dynamically imported children; bail until at
    // least one exists so the index math below can't go negative.
    if (sectionRefs.current.length === 0) return

    const updateMeshes = (index: number) => {
      const visibleMeshes = sectionRefs.current[index].meshes

      sceneModel.current?.traverse(child => {
        const {name} = child
        const chunk = getChild('Chunk', sceneModel.current!)
        const isVisible = visibleMeshes?.includes(name)
        const isHidden = hideMeshes?.includes(name)

        if (isVisible) {
          if (name === 'Atmosphere') {
            child.visible = true

            opacitySpring.set(1)
          } else if (name === 'Chunk') {
            const chunkTarget = new Vector3(-0.4, 0.4, 0.4)

            child.visible = true

            if (reduceMotion) {
              child.position.set(...chunkTarget.toArray())
            } else {
              chunkXSpring.set(chunkTarget.x)
              chunkYSpring.set(chunkTarget.y)
              chunkZSpring.set(chunkTarget.z)
            }
          } else if (name === 'EarthFull' && chunk?.visible) {
            child.visible = false
          } else {
            child.visible = true
          }
        } else if (isHidden && !isVisible) {
          if (name === 'Atmosphere') {
            opacitySpring.set(0)
          } else if (name === 'Chunk') {
            const chunkTarget = new Vector3(0, 0, 0)

            if (isEqualPosition(chunkTarget, chunk?.position ?? {})) {
              child.visible = false
            }

            chunkXSpring.set(chunkTarget.x)
            chunkYSpring.set(chunkTarget.y)
            chunkZSpring.set(chunkTarget.z)
          } else if (name === 'EarthPartial' && chunk?.visible) {
            child.visible = true
          } else {
            child.visible = false
          }
        }
      })
    }

    const updateAnimation = (index: number) => {
      const sectionAnimations = sectionRefs.current[index].animations

      if (reduceMotion) return

      animations.current?.forEach((clip: AnimationClip, index: number) => {
        if (
          !sectionAnimations.find((section: string) =>
            section.includes(index.toString())
          )
        ) {
          const animation = mixer.current?.clipAction(clip)
          animation?.reset().stop()
        }
      })

      if (animations.current?.length && sectionRefs.current[index].animations) {
        sectionAnimations.forEach((animItem: string) => {
          const values = animItem.split(':')
          const clip = animations.current![Number(values[0])]
          const animation = mixer.current?.clipAction(clip)

          if (!animation) return
          if (!values[1] || values[1] !== 'loop') {
            animation.clampWhenFinished = true
            animation.loop = LoopOnce
          }
          animation.play()
        })
      }
    }

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
        currentSection &&
        activeSectionIndex.current !== currentSectionIndex
      ) {
        activeSectionIndex.current = currentSectionIndex
        updateMeshes(currentSectionIndex)
        updateAnimation(currentSectionIndex)
        updateLabels(currentSectionIndex)
      }

      if (grabbingRef.current) return

      if (reduceMotion) {
        camera.current!.position.set(currentX, currentY, currentZ)
        return
      }

      cameraXSpring.set(currentX)
      cameraYSpring.set(currentY)
      cameraZSpring.set(currentZ)
    }

    requestAnimationFrame(update)
  }, [
    cameraXSpring,
    cameraYSpring,
    cameraZSpring,
    chunkXSpring,
    chunkYSpring,
    chunkZSpring,
    hideMeshes,
    opacitySpring,
    reduceMotion,
  ])

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100)

    if (loaded && inViewport) {
      window.addEventListener('scroll', throttledScroll)
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [handleScroll, inViewport, loaded, opacitySpring])

  useEffect(() => {
    const handleControlStart = () => {
      grabbingRef.current = true
      setGrabbing(true)
      cameraXSpring.stop()
      cameraYSpring.stop()
      cameraZSpring.stop()
    }

    const handleControlEnd = () => {
      // Sync the springs to where the drag released (no snap-back), then
      // re-target the active section so the camera glides home from there.
      cameraXSpring.jump(camera.current!.position.x)
      cameraYSpring.jump(camera.current!.position.y)
      cameraZSpring.jump(camera.current!.position.z)
      grabbingRef.current = false
      setGrabbing(false)
      handleScroll()
    }

    controls.current?.addEventListener('start', handleControlStart)
    controls.current?.addEventListener('end', handleControlEnd)

    return () => {
      controls.current?.removeEventListener('start', handleControlStart)
      controls.current?.removeEventListener('end', handleControlEnd)
    }
  }, [cameraXSpring, cameraYSpring, cameraZSpring, handleScroll])

  const registerSection = useCallback((section: EarthSectionData): void => {
    sectionRefs.current = [...sectionRefs.current, section]
  }, [])

  const unregisterSection = useCallback((section: EarthSectionData): void => {
    sectionRefs.current = sectionRefs.current.filter(item => item !== section)
  }, [])

  return (
    <EarthContext.Provider value={{registerSection, unregisterSection}}>
      <div className={classes(styles.earth, className)} ref={container}>
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
    </EarthContext.Provider>
  )
}

export const EarthSection = memo(
  ({
    children,
    scrim,
    scrimReverse,
    className,
    camera = [0, 0, 0],
    animations = [],
    meshes = [],
    labels = [],
  }: {
    children?: React.ReactNode
    scrim?: boolean
    scrimReverse?: boolean
    className?: string
    camera?: number[]
    animations?: string[]
    meshes?: string[]
    labels?: string[]
  }) => {
    const {registerSection, unregisterSection} = useContext(EarthContext)
    const sectionRef = useRef<HTMLDivElement>(null)
    const stringifiedDeps =
      JSON.stringify(animations) +
      JSON.stringify(camera) +
      JSON.stringify(labels) +
      JSON.stringify(meshes)

    useEffect(() => {
      const section = {
        camera,
        animations,
        meshes,
        labels,
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
