import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Long Bio - The bio that says it all',
    template: '%s = Long Bio',
  },
  metadataBase: new URL('/', 'https://longbio.me'),
  description: `Longbio is a social bio platform that lets you create a complete, visually appealing profile in minutes. Showcase who you are and share it across social platforms.`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Long Bio',
    // startupImage: '/manifest-assets/screenshots/apple-splash-2048-2732.jpg',
  },
  formatDetection: {
    telephone: false,
  },
  icons: [
    {
      url: '/assets/images/logo.svg',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/assets/images/logo.svg',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  openGraph: {
    title: 'Long Bio - The bio that says it all',
    description: `Longbio is a social bio platform that lets you create a complete, visually appealing profile in minutes. Showcase who you are and share it across social platforms.`,
    url: '/',
    siteName: 'Long Bio',
    images: [
      {
        url: '/assets/images/logo.svg',
        width: 512,
        height: 512,
        alt: 'Long Bio',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}
