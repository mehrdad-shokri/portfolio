import GothamBook from 'assets/fonts/gotham-book.woff2'
import GothamMedium from 'assets/fonts/gotham-medium.woff2'
import {fontStyles, tokenStyles} from 'components/ThemeProvider/styles'
import 'layouts/App/reset.css'
import 'layouts/App/global.css'
import {Providers} from './providers'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://shokri.dev'),
  title: 'Mehrdad Shokri',
  description: 'Designer + Developer',
  authors: [{name: 'Mehrdad Shokri'}],
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    siteName: 'Mehrdad Shokri',
    images: [{url: '/social-image.png', width: 1280, height: 675}],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@mehrdad_shokri',
    site: '@mehrdad_shokri',
  },
  icons: {
    icon: [
      {url: '/favicon.png', type: 'image/png'},
      {url: '/favicon.svg', type: 'image/svg+xml'},
    ],
    apple: '/icon-256.png',
  },
  manifest: '/manifest.json',
}

import type {ReactNode} from "react"
export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <link rel='preload' href={GothamMedium} as='font' crossOrigin='anonymous' />
        <link rel='preload' href={GothamBook} as='font' crossOrigin='anonymous' />
        <style dangerouslySetInnerHTML={{__html: fontStyles}} />
        <style dangerouslySetInnerHTML={{__html: tokenStyles}} />
      </head>
      <body data-theme='dark' tabIndex={-1}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('theme'));document.body.dataset.theme=t||'dark';}catch(e){}})()`,
          }}
        />
        <Providers>{children}</Providers>
        <div id='portal-root' />
      </body>
    </html>
  )
}
