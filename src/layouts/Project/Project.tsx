'use client'

import {Button} from 'components/Button'
import {Heading} from 'components/Heading'
import {Image} from 'components/Image'
import {Section} from 'components/Section'
import {Text} from 'components/Text'
import {tokens} from 'components/ThemeProvider/theme'
import {Transition} from 'components/Transition'
import {useParallax} from 'hooks'
import {forwardRef, useRef, ReactNode, ElementType} from 'react'
import {classes, cssProps, msToNum, numToMs} from 'utils/style'
import styles from './Project.module.css'

const initDelay = 300

interface ProjectHeaderProps {
  title: string
  description: string
  linkLabel?: string
  url?: string
  roles?: string[]
  className?: string
}

export function ProjectHeader({
  title,
  description,
  linkLabel = 'Visit website',
  url,
  roles,
  className,
}: ProjectHeaderProps) {
  return (
    <Section className={classes(styles.header, className)} as='section'>
      <div
        className={styles.headerContent}
        style={cssProps({initDelay: numToMs(initDelay)})}
      >
        <div className={styles.details}>
          <Heading className={styles.title} level={2} as='h1'>
            {title}
          </Heading>
          <Text className={styles.description} size='xl' as='p'>
            {description}
          </Text>
          {!!url && (
            <Button
              secondary
              iconHoverShift
              className={styles.linkButton}
              icon='chevronRight'
              href={url}
            >
              {linkLabel}
            </Button>
          )}
        </div>
        {!!roles?.length && (
          <ul className={styles.meta}>
            {roles?.map((role, index) => (
              <li
                className={styles.metaItem}
                style={cssProps({
                  delay: numToMs(initDelay + 300 + index * 140),
                })}
                key={role}
              >
                <Text secondary>{role}</Text>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

interface ProjectContainerProps {
  className?: string
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectContainer = ({
  className,
  ...rest
}: ProjectContainerProps) => (
  <article className={classes(styles.project, className)} {...rest} />
)

interface ProjectSectionProps {
  className?: string
  light?: boolean
  padding?: string
  fullHeight?: boolean
  backgroundOverlayOpacity?: number
  backgroundElement?: ReactNode
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(
  (
    {
      className,
      light,
      padding = 'both',
      fullHeight,
      backgroundOverlayOpacity = 0.9,
      backgroundElement,
      children,
      ...rest
    },
    ref
  ) => (
    <section
      className={classes(styles.section, className as string | undefined)}
      data-light={light}
      data-full-height={fullHeight}
      ref={ref}
      {...rest}
    >
      {!!backgroundElement && (
        <div
          className={styles.sectionBackground}
          style={cssProps({opacity: backgroundOverlayOpacity as number})}
        >
          {backgroundElement as ReactNode}
        </div>
      )}
      <Section className={styles.sectionInner} data-padding={padding}>
        {children}
      </Section>
    </section>
  )
)

interface ProjectBackgroundProps {
  opacity?: number
  className?: string
  [key: string]: unknown
}

export const ProjectBackground = ({
  opacity = 0.7,
  className,
  ...rest
}: ProjectBackgroundProps) => {
  const imageRef = useRef<HTMLDivElement>(null)

  useParallax(0.6, value => {
    if (!imageRef.current) return
    imageRef.current.style.setProperty('--offset', `${value}px`)
  })

  return (
    <Transition in timeout={msToNum(tokens.base.durationM)}>
      {visible => (
        <div
          className={classes(styles.backgroundImage, className)}
          data-visible={visible}
        >
          <div className={styles.backgroundImageElement} ref={imageRef}>
            <Image alt='' role='presentation' {...rest} />
          </div>
          <div className={styles.backgroundScrim} style={cssProps({opacity})} />
        </div>
      )}
    </Transition>
  )
}

interface ProjectImageProps {
  className?: string
  alt: string
  [key: string]: unknown
}

export const ProjectImage = ({className, alt, ...rest}: ProjectImageProps) => (
  <div className={classes(styles.image, className)}>
    <Image reveal alt={alt} delay={300} {...rest} />
  </div>
)

interface ProjectSectionContentProps {
  className?: string
  width?: string
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectSectionContent = ({
  className,
  width = 'l',
  ...rest
}: ProjectSectionContentProps) => (
  <div
    className={classes(styles.sectionContent, className)}
    data-width={width}
    {...rest}
  />
)

interface ProjectSectionHeadingProps {
  className?: string
  level?: number
  as?: ElementType
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectSectionHeading = ({
  className,
  level = 3,
  as = 'h2',
  ...rest
}: ProjectSectionHeadingProps) => (
  <Heading
    className={classes(styles.sectionHeading, className)}
    as={as}
    level={level}
    align='auto'
    {...rest}
  />
)

interface ProjectSectionTextProps {
  className?: string
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectSectionText = ({
  className,
  ...rest
}: ProjectSectionTextProps) => (
  <Text
    className={classes(styles.sectionText, className)}
    size='l'
    as='p'
    {...rest}
  />
)

interface ProjectTextRowProps {
  center?: boolean
  stretch?: boolean
  justify?: string
  width?: string
  noMargin?: boolean
  className?: string
  centerMobile?: boolean
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectTextRow = ({
  center,
  stretch,
  justify = 'center',
  width = 'm',
  noMargin,
  className,
  centerMobile,
  ...rest
}: ProjectTextRowProps) => (
  <div
    className={classes(styles.textRow, className)}
    data-center={center}
    data-stretch={stretch}
    data-center-mobile={centerMobile}
    data-no-margin={noMargin}
    data-width={width}
    data-justify={justify}
    {...rest}
  />
)

interface ProjectSectionColumnsProps {
  className?: string
  centered?: boolean
  children?: ReactNode
  [key: string]: unknown
}

export const ProjectSectionColumns = ({
  className,
  centered,
  ...rest
}: ProjectSectionColumnsProps) => (
  <ProjectSectionContent
    className={classes(styles.sectionColumns, className)}
    data-centered={centered}
    {...rest}
  />
)
