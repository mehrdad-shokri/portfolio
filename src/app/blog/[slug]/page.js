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

export async function generateMetadata({params}) {
  const {slug} = await params
  const source = fs.readFileSync(path.join(POSTS_PATH, `${slug}.mdx`), 'utf-8')
  const {data} = matter(source)
  return {title: data.title, description: data.abstract}
}

export default async function BlogPostPage({params}) {
  const {slug} = await params
  const source = fs.readFileSync(path.join(POSTS_PATH, `${slug}.mdx`), 'utf-8')
  const {data: frontmatter, content} = matter(source)

  if (process.env.NODE_ENV === 'production' && frontmatter.draft) notFound()

  const {time} = readingTime(content)
  const timecode = formatTimecode(time)
  const ogImage = await generateOgImage({
    title: frontmatter.title,
    date: frontmatter.date,
    banner: frontmatter.banner,
    timecode,
  }).catch(() => null)

  return (
    <Post timecode={timecode} ogImage={ogImage} {...frontmatter}>
      <MDXRemote
        source={content}
        components={postMarkdown}
        options={{
          mdxOptions: {
            rehypePlugins: [
              rehypePrism,
              rehypeSlug,
              [rehypeImgSize, {dir: 'public'}],
            ],
          },
        }}
      />
    </Post>
  )
}
