import type {Scene, Material, WebGLRenderer, Light, Object3D, Mesh} from 'three'
import {Cache, TextureLoader} from 'three'
import {DRACOLoader, GLTFLoader} from 'three-stdlib'
// three-stdlib exports MeshoptDecoder at runtime but omits it from its type defs.
// @ts-expect-error - missing from three-stdlib type declarations
import {MeshoptDecoder} from 'three-stdlib'

Cache.enabled = true

const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
// The Volvo model is meshopt-compressed (EXT_meshopt_compression, via gltfpack).
// `MeshoptDecoder` is a factory here — call it to get the decoder instance.
gltfLoader.setMeshoptDecoder(MeshoptDecoder())

export const modelLoader = gltfLoader
export const textureLoader = new TextureLoader()

export const cleanScene = (scene: Scene): void => {
  scene?.traverse(object => {
    if (!('isMesh' in object && object.isMesh)) return
    const mesh = object as Mesh
    mesh.geometry.dispose()
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]
    for (const material of materials) cleanMaterial(material)
  })
}

export const cleanMaterial = (material: Material): void => {
  material.dispose()
  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key]
    if (value && typeof value === 'object' && 'minFilter' in value) {
      ;(value as unknown as {dispose: () => void}).dispose()
      const source = (
        value as unknown as {source?: {data?: {close?: () => void}}}
      ).source
      source?.data?.close?.()
    }
  }
}

export const cleanRenderer = (renderer: WebGLRenderer): void => {
  renderer.dispose()
}

export const removeLights = (lights: Light[]): void => {
  for (const light of lights) light.parent?.remove(light)
}

export const getChild = (
  name: string,
  object: Object3D
): Object3D | undefined => {
  let node: Object3D | undefined
  object.traverse(child => {
    if (child.name === name) node = child
  })
  return node
}
