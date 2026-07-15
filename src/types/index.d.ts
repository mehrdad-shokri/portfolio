// CSS Modules
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

// Asset modules
declare module '*.glsl' {
  const value: string
  export default value
}

declare module '*.svg' {
  import type {FC, SVGProps} from 'react'
  const ReactComponent: FC<SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.svg?url' {
  const src: string
  export default src
}

declare module '*.mp4' {
  const src: string
  export default src
}

declare module '*.hdr' {
  const src: string
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}

// NOTE: at runtime these resolve to Next's StaticImageData object (they are
// not covered by the asset/resource rule in next.config.js), so the actual
// value is {src, width, height, blurDataURL} — access .src for the URL.
declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}
