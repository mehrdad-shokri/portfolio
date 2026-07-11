import {Code} from 'components/Code'
import {Heading} from 'components/Heading'
import {Icon} from 'components/Icon'
import {Link} from 'components/Link'
import {List, ListItem} from 'components/List'
import {Text} from 'components/Text'
import {Children, ReactNode, ReactElement} from 'react'
import Img from 'next/image'
import styles from './PostMarkdown.module.css'
import {Image} from 'components/Image'

interface HeadingLinkProps {
  id?: string
}

const PostHeadingLink = ({id}: HeadingLinkProps) => {
  return (
    <a
      className={styles.headingLink}
      href={`#${id}`}
      aria-label='Link to heading'
    >
      <Icon icon='link' />
    </a>
  )
}

interface HeadingProps {
  children?: ReactNode
  id?: string
  [key: string]: unknown
}

const PostH1 = ({children, id, ...rest}: HeadingProps) => (
  <Heading className={styles.heading} id={id} level={2} as='h1' {...rest}>
    <PostHeadingLink id={id} />
    {children}
  </Heading>
)

const PostH2 = ({children, id, ...rest}: HeadingProps) => (
  <Heading className={styles.heading} id={id} level={3} as='h2' {...rest}>
    <PostHeadingLink id={id} />
    {children}
  </Heading>
)

const PostH3 = ({children, id, ...rest}: HeadingProps) => (
  <Heading className={styles.heading} id={id} level={4} as='h3' {...rest}>
    <PostHeadingLink id={id} />
    {children}
  </Heading>
)

const PostH4 = ({children, id, ...rest}: HeadingProps) => (
  <Heading className={styles.heading} id={id} level={5} as='h4' {...rest}>
    <PostHeadingLink id={id} />
    {children}
  </Heading>
)

interface ParagraphProps {
  children?: ReactNode
  [key: string]: unknown
}

const PostParagraph = ({children, ...rest}: ParagraphProps) => {
  const hasSingleChild = Children.count(children) === 1
  const firstChild = Children.toArray(children)[0]

  // Prevent `img` being wrapped in `p`
  if (hasSingleChild && (firstChild as ReactElement).type === PostImage) {
    return <>{children}</>
  }

  return (
    <Text className={styles.paragraph} size='l' as='p' {...rest}>
      {children}
    </Text>
  )
}

const PostLink = ({...props}: Record<string, unknown>) => <Link {...props} />

const PostUl = (props: Record<string, unknown>) => {
  return <List className={styles.list} {...props} />
}

const PostOl = (props: Record<string, unknown>) => {
  return <List className={styles.list} ordered {...props} />
}

interface ListItemProps {
  children?: ReactNode
  [key: string]: unknown
}

const PostLi = ({children, ...props}: ListItemProps) => {
  return <ListItem {...props}>{children}</ListItem>
}

interface CodeProps {
  children?: ReactNode
  [key: string]: unknown
}

const PostCode = ({children, ...rest}: CodeProps) => (
  <code className={styles.code} {...rest}>
    {children}
  </code>
)

const PostPre = (props: Record<string, unknown>) => {
  return (
    <div className={styles.pre}>
      <Code {...props} />
    </div>
  )
}

const PostBlockquote = (props: Record<string, unknown>) => {
  return (
    <blockquote
      className={styles.blockquote}
      {...(props as React.BlockquoteHTMLAttributes<HTMLElement>)}
    />
  )
}

const PostHr = (props: Record<string, unknown>) => {
  return (
    <hr
      className={styles.hr}
      {...(props as React.HTMLAttributes<HTMLHRElement>)}
    />
  )
}

const PostStrong = (props: Record<string, unknown>) => {
  return (
    <strong
      className={styles.strong}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  )
}

interface PostImageProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  [key: string]: unknown
}

const PostImage = ({src, alt, width, height, ...rest}: PostImageProps) => {
  return (
    <Img
      className={styles.image}
      src={src ?? ''}
      decoding='async'
      loading='lazy'
      alt={alt ?? ''}
      width={width ?? 0}
      height={height ?? 0}
      {...(rest as Omit<
        React.ComponentProps<typeof Img>,
        'src' | 'alt' | 'width' | 'height'
      >)}
    />
  )
}

interface VideoProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  placeholder?: string
  [key: string]: unknown
}

const Video = ({src, alt, width, height, placeholder, ...rest}: VideoProps) => {
  return (
    <Image
      className={styles.image}
      src={{src: src ?? ''}}
      placeholder={{src: placeholder ?? ''}}
      alt={alt}
      width={width}
      height={height}
      layout={'fill'}
      {...rest}
    />
  )
}

interface EmbedProps {
  src?: string
  title?: string
}

const Embed = ({src, title}: EmbedProps) => {
  return (
    <div className={styles.embed}>
      <iframe src={src} loading='lazy' title={title} />
    </div>
  )
}

export const postMarkdown = {
  h1: PostH1,
  h2: PostH2,
  h3: PostH3,
  h4: PostH4,
  p: PostParagraph,
  a: PostLink,
  ul: PostUl,
  ol: PostOl,
  li: PostLi,
  pre: PostPre,
  code: PostCode,
  blockquote: PostBlockquote,
  hr: PostHr,
  img: PostImage,
  strong: PostStrong,
  Embed,
  Video: Video,
}
