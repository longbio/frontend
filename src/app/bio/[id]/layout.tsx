import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id: userId } = await params

  return {
    title: `Bio - LongBio`,
    description:
      'Discover amazing people and their stories on LongBio. Connect with like-minded individuals and share your own journey.',
    keywords: ['bio', 'profile', 'social', 'networking', 'longbio'],
    authors: [{ name: 'LongBio Team' }],
    creator: 'LongBio',
    publisher: 'LongBio',

    // Open Graph / Facebook
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://longbio.me/bio/${userId}`,
      title: 'Bio - LongBio',
      description:
        'Discover amazing people and their stories on LongBio. Connect with like-minded individuals and share your own journey.',
      siteName: 'LongBio',
      images: [
        {
          url: '/assets/images/cover-image.png',
          width: 1200,
          height: 630,
          alt: 'LongBio - Discover Amazing People',
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: 'Bio - LongBio',
      description:
        'Discover amazing people and their stories on LongBio. Connect with like-minded individuals and share your own journey.',
      images: ['/assets/images/cover-image.png'],
      creator: '@longbio',
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // App specific
    applicationName: 'LongBio',
    category: 'social',

    // Viewport and mobile
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },

    // Icons
    icons: {
      icon: '/assets/images/logo.svg',
      shortcut: '/assets/images/logo.svg',
      apple: '/assets/images/logo.svg',
    },

    // Manifest
    manifest: '/manifest.json',

    // Theme
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
      { media: '(prefers-color-scheme: dark)', color: '#7C3AED' },
    ],
  }
}

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
