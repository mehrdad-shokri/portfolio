import iphone11 from 'assets/iphone-11.glb'
import macbookPro from 'assets/macbook-pro.glb'
import volvoTruck from 'assets/volvo.glb'

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
} as const

export type ModelAnimationTypeValue =
  (typeof ModelAnimationType)[keyof typeof ModelAnimationType]

export interface DeviceModel {
  url: string
  width: number
  height: number
  position: {x: number; y: number; z: number}
  animation: ModelAnimationTypeValue
  scale?: number
  rotation?: {x: number; y: number; z: number}
  keepMaterials?: boolean
  autoRotate?: number
  materialOverrides?: Record<
    string,
    {color?: string; metalness?: number; roughness?: number}
  >
}

export const deviceModels: Record<string, DeviceModel> = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    position: {x: 0, y: 0, z: 0},
    animation: ModelAnimationType.SpringUp,
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    position: {x: 0, y: 0, z: 0},
    animation: ModelAnimationType.LaptopOpen,
  },
  volvoTruck: {
    url: volvoTruck,
    width: 1280,
    height: 800,
    position: {x: 0, y: -0.6, z: 0},
    animation: ModelAnimationType.SpringUp,
    // ~half the laptop's on-screen size (truck is ~7.2u vs laptop ~3.46u).
    scale: 0.5,
    // Turn 180° so the front of the truck faces the camera.
    rotation: {x: 0, y: Math.PI, z: 0},
    // Keep the model's own paint/materials instead of the dark device frame.
    keepMaterials: true,
    // Vitrine-style spin: one full turn every ~16s.
    autoRotate: (2 * Math.PI) / 16,
    // Repaint by material name; VERMELHO_VOLVO is the cab's body paint.
    // Light metallic teal: pale silvery green-blue that reads mint in the
    // key light and seafoam in the shade as the truck rotates.
    materialOverrides: {
      VERMELHO_VOLVO: {color: '#a9d6c9', metalness: 0.55, roughness: 0.25},
    },
  },
}
