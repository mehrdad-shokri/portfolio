import path from 'path'
import fs from 'fs'
import {createHash} from 'crypto'
import type {LaunchOptions as PuppeteerLaunchOptions} from "puppeteer-core"

const localChromePaths: Record<string, string> = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
}

interface OgImageProps {
  title?: string
  date?: string
  banner?: string
  timecode?: string
}

export async function generateOgImage(props: OgImageProps): Promise<string> {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(props).filter(([, v]) => v != null)
    ) as Record<string, string>
  )
  const url = `file:${path.join(process.cwd(), `src/app/blog/og-image.html?${params}`)}`

  const hash = createHash('md5').update(url).digest('hex')
  const ogImageDir = path.join(process.cwd(), `public/og`)
  const imageName = `${hash}.png`
  const imagePath = `${ogImageDir}/${imageName}`
  const publicPath = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/og/${imageName}`

  try {
    fs.statSync(imagePath)
    return publicPath
  } catch {
    // file does not exist, so we create it
  }

  const isVercel = !!process.env.VERCEL_ENV
  const puppeteer = await import('puppeteer-core')
  let launchOptions: PuppeteerLaunchOptions = {headless: true}

  if (isVercel) {
    const chromium = (await import('@sparticuz/chromium')).default
    launchOptions = {
      ...launchOptions,
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    }
  } else {
    launchOptions = {
      ...launchOptions,
      args: ['--no-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ??
        localChromePaths[process.platform] ??
        localChromePaths.linux,
    }
  }

  let browser
  try {
    browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    await page.setViewport({width: 1200, height: 630})
    await page.goto(url, {waitUntil: 'networkidle0'})
    const buffer = await page.screenshot()
    fs.mkdirSync(ogImageDir, {recursive: true})
    fs.writeFileSync(imagePath, buffer)
  } finally {
    await browser?.close()
  }

  return publicPath
}
