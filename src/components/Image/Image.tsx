'use client'

import type {CSSProperties, MouseEvent} from 'react'
import type {SrcSetItem} from 'utils/image'
import {Button} from 'components/Button'
import {Icon} from 'components/Icon'
import {useTheme} from 'components/ThemeProvider'
import {useReducedMotion} from 'framer-motion'
import {useHasMounted, useInViewport} from 'hooks'
import Img from 'next/image'
import {Fragment, useCallback, useEffect, useRef, useState} from 'react'
import {resolveSrcFromSrcSet, srcSetToString} from 'utils/image'
import {classes, cssProps, numToMs} from 'utils/style'
import styles from './Image.module.css'

interface ImageSrc {
  src: string
  width?: number
  height?: number
}

interface ImageProps {
  className?: string
  style?: CSSProperties
  reveal?: boolean
  delay?: number
  raised?: boolean
  src?: ImageSrc
  srcSet?: SrcSetItem[]
  placeholder?: ImageSrc
  alt?: string
  layout?: string
  play?: boolean
  restartOnPause?: boolean
  sizes?: string
  noPauseButton?: boolean
  [key: string]: unknown
}

export const Image = ({
  className,
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc,
  srcSet,
  placeholder,
  layout,
  ...rest
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const {themeId} = useTheme() as {themeId: string}
  const containerRef = useRef<HTMLDivElement>(null)
  const src =
    baseSrc ??
    (srcSet ? {src: srcSet[0].src, width: srcSet[0].width} : undefined)
  const inViewport = useInViewport(containerRef, !getIsVideo(src))
  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <div
      className={classes(styles.image, className)}
      data-visible={inViewport || loaded}
      data-reveal={reveal}
      data-raised={raised}
      data-theme={themeId}
      style={cssProps({delay: numToMs(delay)}, style)}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        src={src}
        srcSet={srcSet}
        placeholder={placeholder}
        layout={layout}
        {...rest}
      />
    </div>
  )
}

const ImageElements = ({
  onLoad,
  loaded,
  inViewport,
  srcSet,
  placeholder,
  delay = 0,
  src,
  alt,
  play = true,
  restartOnPause,
  reveal,
  sizes,
  noPauseButton,
  layout,
  ...rest
}: ImageProps & {onLoad: () => void; loaded: boolean; inViewport: boolean}) => {
  const reduceMotion = useReducedMotion()
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [playing, setPlaying] = useState(!reduceMotion)
  const [videoSrc, setVideoSrc] = useState<string | undefined>()
  const [videoInteracted, setVideoInteracted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideo = getIsVideo(src)
  const showFullRes = inViewport
  const srcSetString = srcSetToString(srcSet)
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (isVideo && srcSet) {
      resolveSrcFromSrcSet({srcSet, sizes}).then(setVideoSrc)
    } else if (isVideo && src) {
      setVideoSrc(src.src)
    }
  }, [isVideo, sizes, src, srcSet])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return
    if (!play) {
      setPlaying(false)
      video.pause()
      if (restartOnPause) video.currentTime = 0
    }
    if (videoInteracted) return
    if (!inViewport) {
      setPlaying(false)
      video.pause()
    } else if (inViewport && !reduceMotion && play) {
      setPlaying(true)
      video.play()
    }
  }, [
    inViewport,
    play,
    reduceMotion,
    restartOnPause,
    videoInteracted,
    videoSrc,
  ])

  const togglePlaying = (event: MouseEvent) => {
    event.preventDefault()
    setVideoInteracted(true)
    if (videoRef.current?.paused) {
      setPlaying(true)
      videoRef.current.play()
    } else {
      setPlaying(false)
      videoRef.current?.pause()
    }
  }

  return (
    <div
      className={styles.elementWrapper}
      data-reveal={reveal}
      data-visible={inViewport || loaded}
      style={cssProps({delay: numToMs(delay + 1000)})}
    >
      {isVideo && hasMounted && (
        <Fragment>
          <video
            muted
            loop
            playsInline
            className={styles.element}
            data-loaded={loaded}
            autoPlay={!reduceMotion}
            onLoadStart={onLoad}
            src={videoSrc}
            aria-label={alt}
            ref={videoRef}
            {...(rest as object)}
          />
          {!noPauseButton && (
            <Button className={styles.button} onClick={togglePlaying}>
              <Icon icon={playing ? 'pause' : 'play'} />
              {playing ? 'Pause' : 'Play'}
            </Button>
          )}
        </Fragment>
      )}
      {!isVideo && src && (
        <Img
          {...({'data-loaded': loaded} as object)}
          className={styles.element}
          onLoad={onLoad}
          decoding='async'
          src={showFullRes ? src.src : '/placeholder.jpg'}
          width={src.width ?? 1}
          height={src.height ?? 1}
          alt={alt ?? ''}
          sizes={sizes}
          {...(rest as object)}
        />
      )}
      {showPlaceholder && placeholder && (
        <Img
          aria-hidden
          className={styles.placeholder}
          data-loaded={loaded}
          style={cssProps({delay: numToMs(delay)})}
          src={placeholder.src}
          width={placeholder.width ?? 1}
          height={placeholder.height ?? 1}
          onTransitionEnd={() => setShowPlaceholder(false)}
          decoding='async'
          alt=''
          role='presentation'
        />
      )}
    </div>
  )
}

function getIsVideo(src?: ImageSrc): boolean {
  return (
    typeof src?.src === 'string' &&
    (src.src.endsWith('.mp4') || src.src.endsWith('.mov'))
  )
}
