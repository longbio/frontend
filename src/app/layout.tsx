import './globals.css'
import Script from 'next/script'
import { type Viewport } from 'next'
import localFont from 'next/font/local'
import Providers from '../../providers'
import { GA_TRACKING_ID } from '../lib/gtag'
import { ViewTransitions } from 'next-view-transitions'
export { metadata } from '@/lib/configs/metadata'

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
        {/* TODO: Replace these with @next/third-parties package */}
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
