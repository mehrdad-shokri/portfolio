import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import {POSTS_PATH, postFilePaths} from 'utils/mdx'
import {formatTimecode} from 'utils/timecode'
import {Articles} from './Articles'

export const metadata = {
  title: 'Blog',
  description: 'Articles on design, development, and the web.',
}

export default async function BlogPage() {
  const allPosts = postFilePaths.map(filePath => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
    const {data, content} = matter(source)
    const {time} = readingTime(content)
    const timecode = formatTimecode(time)
    return {...data, timecode, slug: filePath.replace(/\.mdx?$/, '')}
  })

  const featured = allPosts.find(post => post.featured)
  const posts = allPosts
    .filter(post => post.slug !== featured?.slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return <Articles posts={posts} featured={featured} />
}
