import fs from 'fs'
import path from 'path'

export const POSTS_PATH = path.join(process.cwd(), 'src/posts')

export const postFilePaths: string[] = fs
  .readdirSync(POSTS_PATH)
  .filter((filePath: string) => /\.mdx?$/.test(filePath))
