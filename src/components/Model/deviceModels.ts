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
    position: {x: 0, y: -0.5, z: 0},
    animation: ModelAnimationType.SpringUp,
    // ~half the laptop's on-screen size (truck is ~7.2u vs laptop ~3.46u).
    scale: 0.5,
    // Turn 180° so the front of the truck faces the camera.
    rotation: {x: 0, y: Math.PI, z: 0},
    // Keep the model's own paint/materials instead of the dark device frame.
    keepMaterials: true,
    // Vitrine-style spin: one full turn every ~18s.
    autoRotate: (2 * Math.PI) / 18,
  },
}
