'use client'

import {animate, useReducedMotion, useSpring} from 'framer-motion'
import {useInViewport} from 'hooks'
import {useFps} from 'hooks/useFps'
import {
  createRef,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Light,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  sRGBEncoding,
  Texture,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
import {HorizontalBlurShader} from 'three-stdlib/shaders/HorizontalBlurShader'
import {VerticalBlurShader} from 'three-stdlib/shaders/VerticalBlurShader'
import {resolveSrcFromSrcSet} from 'utils/image'
import {classes, cssProps, numToMs} from 'utils/style'
import {
  cleanRenderer,
  cleanScene,
  modelLoader,
  removeLights,
  textureLoader,
} from 'utils/three'
import styles from './Model.module.css'
import {ModelAnimationType, ModelAnimationTypeValue} from './deviceModels'

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
} as const

const rotationSpringConfig = {
  stiffness: 40,
  damping: 20,
  mass: 1.4,
  restSpeed: 0.001,
}

export interface ModelTexture {
  src?: {src: string}
  srcSet?: Array<{src: string; width?: number}>
  sizes?: string
  placeholder: {src: string}
}

export interface ModelConfig {
  url: string
  width: number
  height: number
  position: {x: number; y: number; z: number}
  animation: ModelAnimationTypeValue
  texture: ModelTexture
  // Uniform scale applied to the loaded model (defaults to 1).
  scale?: number
  // Base orientation in radians, e.g. {y: Math.PI} to face the model forward.
  rotation?: {x: number; y: number; z: number}
  // Keep the glTF's own materials instead of the dark device-frame override.
  keepMaterials?: boolean
  // Continuous vitrine-style spin around Y in rad/s, composed with the
  // pointer-driven tilt. Disabled when unset or when motion is reduced.
  autoRotate?: number
}

interface ModelProps {
  models: ModelConfig[]
  show?: boolean
  showDelay?: number
  cameraPosition?: {x: number; y: number; z: number}
  // Multiplier for how much the model rotates with the mouse (defaults to 1).
  rotationFactor?: number
  style?: React.CSSProperties
  className?: string
  alt?: string
  [key: string]: unknown
}

export const Model = ({
  models,
  show = true,
  showDelay = 0,
  cameraPosition = {x: 0, y: 0, z: 8},
  rotationFactor = 1,
  style,
  className,
  alt,
  ...rest
}: ModelProps) => {
  const [loaded, setLoaded] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const camera = useRef<PerspectiveCamera | null>(null)
  const modelGroup = useRef<Group | null>(null)
  const scene = useRef<Scene | null>(null)
  const renderer = useRef<WebGLRenderer | null>(null)
  const shadowGroup = useRef<Group | null>(null)
  const renderTarget = useRef<WebGLRenderTarget | null>(null)
  const renderTargetBlur = useRef<WebGLRenderTarget | null>(null)
  const shadowCamera = useRef<OrthographicCamera | null>(null)
  const depthMaterial = useRef<MeshDepthMaterial | null>(null)
  const horizontalBlurMaterial = useRef<ShaderMaterial | null>(null)
  const verticalBlurMaterial = useRef<ShaderMaterial | null>(null)
  const plane = useRef<Mesh | null>(null)
  const lights = useRef<Light[] | null>(null)
  const blurPlane = useRef<Mesh | null>(null)
  const fillPlane = useRef<Mesh | null>(null)
  const isInViewport = useInViewport(container, false, {threshold: 0.2})
  const reduceMotion = useReducedMotion()
  const rotationX = useSpring(0, rotationSpringConfig)
  const rotationY = useSpring(0, rotationSpringConfig)
  const autoRotateY = useRef(0)
  const {measureFps, isLowFps} = useFps(isInViewport)

  useEffect(() => {
    const {clientWidth, clientHeight} = container.current!

    renderer.current = new WebGLRenderer({
      canvas: canvas.current ?? undefined,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    })

    renderer.current.setPixelRatio(2)
    renderer.current.setSize(clientWidth, clientHeight)
    renderer.current.outputEncoding = sRGBEncoding
    renderer.current.physicallyCorrectLights = true

    camera.current = new PerspectiveCamera(
      36,
      clientWidth / clientHeight,
      0.1,
      100
    )
    camera.current.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    )
    scene.current = new Scene()

    modelGroup.current = new Group()
    scene.current.add(modelGroup.current)

    // Lighting
    const ambientLight = new AmbientLight(0xffffff, 1.2)
    const keyLight = new DirectionalLight(0xffffff, 1.1)
    const fillLight = new DirectionalLight(0xffffff, 0.8)

    fillLight.position.set(-6, 2, 2)
    keyLight.position.set(0.5, 0, 0.866)
    lights.current = [ambientLight, keyLight, fillLight]
    lights.current.forEach(light => scene.current!.add(light))

    // The shadow container, if you need to move the plane just move this
    shadowGroup.current = new Group()
    scene.current.add(shadowGroup.current)
    shadowGroup.current.position.set(0, 0, -0.8)
    shadowGroup.current.rotateX(Math.PI / 2)

    const renderTargetSize = 512
    const planeWidth = 8
    const planeHeight = 8
    const cameraHeight = 1.5
    const shadowOpacity = 0.8
    const shadowDarkness = 3

    // The render target that will show the shadows in the plane texture
    renderTarget.current = new WebGLRenderTarget(
      renderTargetSize,
      renderTargetSize
    )
    renderTarget.current.texture.generateMipmaps = false

    // The render target that we will use to blur the first render target
    renderTargetBlur.current = new WebGLRenderTarget(
      renderTargetSize,
      renderTargetSize
    )
    renderTargetBlur.current.texture.generateMipmaps = false

    // Make a plane and make it face up
    const planeGeometry = new PlaneGeometry(planeWidth, planeHeight).rotateX(
      Math.PI / 2
    )

    const planeMaterial = new MeshBasicMaterial({
      map: renderTarget.current.texture,
      opacity: shadowOpacity,
      transparent: true,
    })

    plane.current = new Mesh(planeGeometry, planeMaterial)
    // The y from the texture is flipped!
    plane.current.scale.y = -1
    shadowGroup.current.add(plane.current)

    // The plane onto which to blur the texture
    blurPlane.current = new Mesh(planeGeometry)
    blurPlane.current.visible = false
    shadowGroup.current.add(blurPlane.current)

    // The plane with the color of the ground
    const fillMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    })

    fillPlane.current = new Mesh(planeGeometry, fillMaterial)
    fillPlane.current.rotateX(Math.PI)
    fillPlane.current.position.y -= 0.00001
    shadowGroup.current.add(fillPlane.current)

    // The camera to render the depth material from
    shadowCamera.current = new OrthographicCamera(
      -planeWidth / 2,
      planeWidth / 2,
      planeHeight / 2,
      -planeHeight / 2,
      0,
      cameraHeight
    )
    // Get the camera to look up
    shadowCamera.current.rotation.x = Math.PI / 2
    shadowGroup.current.add(shadowCamera.current)

    // Like MeshDepthMaterial, but goes from black to transparent
    depthMaterial.current = new MeshDepthMaterial()
    depthMaterial.current.userData.darkness = {value: shadowDarkness}
    depthMaterial.current.onBeforeCompile = shader => {
      shader.uniforms.darkness = depthMaterial.current!.userData.darkness
      shader.fragmentShader = `
        uniform float darkness;
        ${shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        )}
      `
    }
    depthMaterial.current.depthTest = false
    depthMaterial.current.depthWrite = false

    horizontalBlurMaterial.current = new ShaderMaterial(HorizontalBlurShader)
    horizontalBlurMaterial.current.depthTest = false

    verticalBlurMaterial.current = new ShaderMaterial(VerticalBlurShader)
    verticalBlurMaterial.current.depthTest = false

    const unsubscribeX = rotationX.on('change', renderFrame)
    const unsubscribeY = rotationY.on('change', renderFrame)

    return () => {
      renderTarget.current!.dispose()
      renderTargetBlur.current!.dispose()
      removeLights(lights.current!)
      cleanScene(scene.current!)
      cleanRenderer(renderer.current!)
      unsubscribeX()
      unsubscribeY()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const blurShadow = useCallback((amount: number) => {
    blurPlane.current!.visible = true

    // Blur horizontally and draw in the renderTargetBlur
    ;(blurPlane.current as Mesh).material = horizontalBlurMaterial.current!
    ;(
      horizontalBlurMaterial.current!.uniforms.tDiffuse as {value: Texture}
    ).value = renderTarget.current!.texture
    horizontalBlurMaterial.current!.uniforms.h.value = amount * (1 / 256)

    renderer.current!.setRenderTarget(renderTargetBlur.current)
    renderer.current!.render(blurPlane.current!, shadowCamera.current!)

    // Blur vertically and draw in the main renderTarget
    ;(blurPlane.current as Mesh).material = verticalBlurMaterial.current!
    ;(
      verticalBlurMaterial.current!.uniforms.tDiffuse as {value: Texture}
    ).value = renderTargetBlur.current!.texture
    verticalBlurMaterial.current!.uniforms.v.value = amount * (1 / 256)

    renderer.current!.setRenderTarget(renderTarget.current)
    renderer.current!.render(blurPlane.current!, shadowCamera.current!)

    blurPlane.current!.visible = false
  }, [])

  // Handle render passes for a single frame
  const renderFrame = useCallback(() => {
    const blurAmount = 5

    // Remove the background
    const initialBackground = scene.current!.background
    scene.current!.background = null

    // Force the depthMaterial to everything
    scene.current!.overrideMaterial = depthMaterial.current

    // Render to the render target to get the depths
    renderer.current!.setRenderTarget(renderTarget.current)
    renderer.current!.render(scene.current!, shadowCamera.current!)

    // And reset the override material
    scene.current!.overrideMaterial = null

    blurShadow(blurAmount)

    // A second pass to reduce the artifacts
    // (0.4 is the minimum blur amount so that the artifacts are gone)
    blurShadow(blurAmount * 0.4)

    // Reset and render the normal scene
    renderer.current!.setRenderTarget(null)
    scene.current!.background = initialBackground

    modelGroup.current!.rotation.x = rotationX.get()
    modelGroup.current!.rotation.y = rotationY.get() + autoRotateY.current

    renderer.current!.render(scene.current!, camera.current!)
    measureFps()

    if (isLowFps.current) {
      renderer.current!.setPixelRatio(1)
    } else {
      renderer.current!.setPixelRatio(2)
    }
  }, [blurShadow, isLowFps, measureFps, rotationX, rotationY])

  // Continuous showcase rotation: advance the yaw offset every frame so the
  // model spins like a shop vitrine, while the pointer springs still tilt it.
  const autoRotateSpeed = models.reduce(
    (max, {autoRotate}) => Math.max(max, autoRotate ?? 0),
    0
  )

  useEffect(() => {
    if (!autoRotateSpeed || !loaded || !isInViewport || reduceMotion) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      autoRotateY.current += autoRotateSpeed * ((now - last) / 1000)
      last = now
      renderFrame()
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [autoRotateSpeed, loaded, isInViewport, reduceMotion, renderFrame])

  // Handle mouse move animation
  useEffect(() => {
    const rotateToPoint = (clientX: number, clientY: number) => {
      const {innerWidth, innerHeight} = window

      const position = {
        x: (clientX - innerWidth / 2) / innerWidth,
        y: (clientY - innerHeight / 2) / innerHeight,
      }

      rotationY.set((position.x / 2) * rotationFactor)
      rotationX.set((position.y / 2) * rotationFactor)
    }

    const onMouseMove = (event: MouseEvent) =>
      rotateToPoint(event.clientX, event.clientY)

    // Touch equivalent for phones/tablets: dragging a finger tilts the model
    // just like the cursor does. Passive so it never blocks page scrolling.
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) rotateToPoint(touch.clientX, touch.clientY)
    }

    if (isInViewport && !reduceMotion) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('touchmove', onTouchMove, {passive: true})
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [isInViewport, reduceMotion, rotationX, rotationY, rotationFactor])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!container.current) return

      const {clientWidth, clientHeight} = container.current

      renderer.current!.setSize(clientWidth, clientHeight)
      camera.current!.aspect = clientWidth / clientHeight
      camera.current!.updateProjectionMatrix()

      renderFrame()
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [renderFrame])

  return (
    <div
      className={classes(styles.model, className)}
      data-loaded={loaded}
      style={cssProps({delay: numToMs(showDelay)}, style)}
      ref={container}
      role='img'
      aria-label={alt}
      {...rest}
    >
      <canvas className={styles.canvas} ref={canvas} />
      {models.map((model, index) => (
        <Device
          key={JSON.stringify(model.position)}
          renderer={renderer}
          modelGroup={modelGroup}
          show={show}
          showDelay={showDelay}
          renderFrame={renderFrame}
          index={index}
          setLoaded={setLoaded}
          model={model}
        />
      ))}
    </div>
  )
}

interface DeviceProps {
  renderer: React.RefObject<WebGLRenderer | null>
  model: ModelConfig
  modelGroup: React.RefObject<Group | null>
  renderFrame: () => void
  index: number
  showDelay: number
  setLoaded: (loaded: boolean) => void
  show: boolean
}

interface LoadDevice {
  start: () => Promise<{
    loadFullResTexture: (() => Promise<void>) | undefined
    playAnimation: (() => {stop: () => void} | void) | undefined
  }>
}

const Device = ({
  renderer,
  model,
  modelGroup,
  renderFrame,
  index,
  showDelay,
  setLoaded,
  show,
}: DeviceProps) => {
  const [loadDevice, setLoadDevice] = useState<LoadDevice | undefined>()
  const reduceMotion = useReducedMotion()
  const placeholderScreen =
    createRef<Mesh | null>() as React.MutableRefObject<Mesh | null>
  const modelScene = useRef<Group | null>(null)
  const modelScale = useRef(model.scale)

  // The window size is only measured after mount, so a scale derived from it
  // (e.g. the mobile truck scale) arrives after the load effect has already
  // captured its first-render props. Track the latest value in a ref for
  // load() and re-apply it if it changes once the scene is loaded.
  useEffect(() => {
    modelScale.current = model.scale
    if (modelScene.current && model.scale != null) {
      modelScene.current.scale.setScalar(model.scale)
      renderFrame()
    }
  }, [model.scale, renderFrame])

  useEffect(() => {
    const applyScreenTexture = async (texture: Texture, node: Mesh) => {
      texture.encoding = sRGBEncoding
      texture.flipY = false
      texture.anisotropy = renderer.current!.capabilities.getMaxAnisotropy()
      texture.generateMipmaps = false

      // Decode the texture to prevent jank on first render
      await renderer.current!.initTexture(texture)

      const mat = node.material as MeshBasicMaterial
      mat.color = new Color(0xffffff)
      mat.transparent = true
      mat.map = texture
    }

    // Generate promises to await when ready
    const load = async () => {
      const {texture, position, url} = model
      let loadFullResTexture: (() => Promise<void>) | undefined
      let playAnimation: (() => {stop: () => void} | void) | undefined
      const placeholder = await textureLoader.loadAsync(texture.placeholder.src)
      const gltf = await modelLoader.loadAsync(url)
      modelGroup.current!.add(gltf.scene)
      modelScene.current = gltf.scene

      // Per-model base orientation (e.g. face the truck forward) and scale.
      if (model.rotation) {
        gltf.scene.rotation.set(
          model.rotation.x,
          model.rotation.y,
          model.rotation.z
        )
      }
      if (modelScale.current != null) {
        gltf.scene.scale.setScalar(modelScale.current)
      }

      gltf.scene.traverse(async (node: Object3D) => {
        const meshNode = node as Mesh & {material?: MeshBasicMaterial}
        // Devices get a dark frame override; models flagged keepMaterials
        // (e.g. the truck) keep their own glTF colors/materials.
        if (!model.keepMaterials && meshNode.material) {
          meshNode.material.color = new Color(0x161d25)
          meshNode.material.color.convertSRGBToLinear()
        }
        if (node.name === MeshType.Screen) {
          const screenMesh = node as Mesh
          // Create a copy of the screen mesh so we can fade it out
          // over the full resolution screen texture
          placeholderScreen.current = screenMesh.clone() as Mesh
          placeholderScreen.current.material = (
            screenMesh.material as MeshBasicMaterial
          ).clone()
          screenMesh.parent!.add(placeholderScreen.current)
          ;(placeholderScreen.current.material as MeshBasicMaterial).opacity = 1
          placeholderScreen.current.position.z += 0.001

          applyScreenTexture(placeholder, placeholderScreen.current)

          loadFullResTexture = async () => {
            const image = await resolveSrcFromSrcSet({
              srcSet: (texture.srcSet ??
                []) as import('utils/image').SrcSetItem[],
              sizes: texture.sizes,
            })
            const fullSize = await textureLoader.loadAsync(image)
            await applyScreenTexture(fullSize, screenMesh as Mesh)

            animate(1, 0, {
              onUpdate: value => {
                // eslint-disable-next-line no-extra-semi
                ;(
                  placeholderScreen.current!.material as MeshBasicMaterial
                ).opacity = value
                renderFrame()
              },
            })
          }
        }
      })
      const targetPosition = new Vector3(position.x, position.y, position.z)

      if (reduceMotion) {
        gltf.scene.position.set(
          ...(targetPosition.toArray() as [number, number, number])
        )
      }
      // Simple slide up animation
      if (model.animation === ModelAnimationType.SpringUp) {
        playAnimation = () => {
          const startPosition = new Vector3(
            targetPosition.x,
            targetPosition.y - 1,
            targetPosition.z
          )

          gltf.scene.position.set(
            ...(startPosition.toArray() as [number, number, number])
          )

          return animate(startPosition.y, targetPosition.y, {
            type: 'spring',
            delay: (300 * index + showDelay) / 1000,
            stiffness: 60,
            damping: 20,
            mass: 1,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              gltf.scene.position.y = value
              renderFrame()
            },
          })
        }
      }

      // Swing the laptop lid open
      if (model.animation === ModelAnimationType.LaptopOpen) {
        playAnimation = () => {
          const frameNode = gltf.scene.children.find(
            (node: Object3D) => node.name === MeshType.Frame
          )
          const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0)
          const endRotation = new Vector3(0, 0, 0)

          gltf.scene.position.set(
            ...(targetPosition.toArray() as [number, number, number])
          )
          if (frameNode) {
            frameNode.rotation.set(
              ...(startRotation.toArray() as [number, number, number])
            )
          }

          return animate(startRotation.x, endRotation.x, {
            type: 'spring',
            delay: (300 * index + showDelay + 300) / 1000,
            stiffness: 80,
            damping: 20,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              if (frameNode) frameNode.rotation.x = value
              renderFrame()
            },
          })
        }
      }

      return {loadFullResTexture, playAnimation}
    }

    setLoadDevice({start: load})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loadDevice || !show) return
    let animation: {stop: () => void} | void | undefined

    const onLoad = async () => {
      const {loadFullResTexture, playAnimation} = await loadDevice.start()

      setLoaded(true)

      if (!reduceMotion) {
        animation = playAnimation?.()
      }

      await loadFullResTexture?.()

      if (reduceMotion) {
        renderFrame()
      }
    }

    startTransition(() => {
      onLoad().catch(error => {
        if (process.env.NODE_ENV === 'development') {
          // three.js ImageLoader rejects with the <img> error Event, which
          // has no message — the failing URL lives on its target.
          const failedUrl =
            error instanceof Event && error.target instanceof HTMLImageElement
              ? error.target.src
              : undefined
          console.error('Model load failed:', failedUrl ?? error)
        }
      })
    })

    return () => {
      animation?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDevice, show])

  return null
}
