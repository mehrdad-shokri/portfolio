import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import {MDXRemote} from 'next-mdx-remote/rsc'
import rehypeImgSize from 'rehype-img-size'
import rehypeSlug from 'rehype-slug'
import rehypePrism from 'rehype-prism-plus'
import {notFound} from 'next/navigation'
import {POSTS_PATH, postFilePaths} from 'utils/mdx'
import {formatTimecode} from 'utils/timecode'
import {generateOgImage} from 'app/blog/og-image'
import {Post} from 'layouts/Post/Post'
import {postMarkdown} from 'layouts/Post/PostMarkdown'

export async function generateStaticParams() {
  return postFilePaths
    .map(filePath => filePath.replace(/\.mdx?$/, ''))
    .map(slug => ({slug}))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const source = fs.readFileSync(path.join(POSTS_PATH, `${slug}.mdx`), 'utf-8')
  const {data} = matter(source)
  return {title: data.title as string, description: data.abstract as string}
}

export default async function BlogPostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const source = fs.readFileSync(path.join(POSTS_PATH, `${slug}.mdx`), 'utf-8')
  const {data: frontmatter, content} = matter(source)

  if (process.env.NODE_ENV === 'production' && frontmatter.draft) notFound()

  const {time} = readingTime(content)
  const timecode = formatTimecode(time)
  const ogImage = await generateOgImage({
    title: frontmatter.title as string,
    date: frontmatter.date as string,
    banner: frontmatter.banner as string,
    timecode,
  }).catch(() => null)

  return (
    <Post timecode={timecode} ogImage={ogImage ?? undefined} {...(frontmatter as {title: string; date: string; abstract: string; banner: string; draft?: boolean})}>
      <MDXRemote
        source={content}
        components={postMarkdown}
        options={{
          mdxOptions: {
            rehypePlugins: [
              rehypePrism as never,
              rehypeSlug as never,
              [rehypeImgSize, {dir: 'public'}] as never,
            ],
          },
        }}
      />
    </Post>
  )
}
