import './globals.css'
import Script from 'next/script'
import localFont from 'next/font/local'
import Providers from '../../providers'
import { GA_TRACKING_ID } from '../lib/gtag'
import type { Metadata, Viewport } from 'next'
import { ViewTransitions } from 'next-view-transitions'

const gilroy = localFont({
  src: [
    {
      path: '../../public/fonts/Gilroy-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Gilroy-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Gilroy-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Gilroy-ExtaBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://longbio.me'),
  description: "Longbio is a social bio platform that helps people showcase who they really are — beyond the limits of a short Instagram bio. In just two minutes, users can create a complete, beautifully designed profile that includes all the details others might want to know about them. The profile can then be shared anywhere — from an Instagram bio to any social link — helping friends, followers, and communities get to know them better.",
  title: {
    default: "Long Bio - The bio that says it all",
    template: "%s = Long Bio"
  },
  icons: {
    icon: '/assets/images/logo.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#7C3AED' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${gilroy.variable}`}>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Providers>
          <ViewTransitions>
            <section className="container max-w-[480px] mx-auto">
              <div className="h-[100dvh]">{children}</div>
            </section>
          </ViewTransitions>
        </Providers>
      </body>
    </html>
  )
}
