import type {Metadata} from 'next'

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL
const name = 'Mehrdad Shokri'
const defaultOgImage = `${siteUrl}/social-image.png`

interface MetaProps {
  title?: string
  description?: string
  prefix?: string
  ogImage?: string
}

export function buildMetadata({
  title,
  description,
  prefix = name,
  ogImage = defaultOgImage,
}: MetaProps): Metadata {
  const titleText = [prefix, title].filter(Boolean).join(' | ')
  return {
    title: titleText,
    description,
    authors: [{name}],
    openGraph: {
      images: [
        {url: ogImage, width: 1280, height: 675, alt: 'Banner for the site'},
      ],
      title: titleText,
      siteName: name,
      type: 'website',
      url: siteUrl,
      description,
    },
  }
}

export const Meta = ({title, description, prefix, ogImage}: MetaProps) => null
