import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const gilroy = localFont({
  src: [
    {
      path: '../public/fonts/Gilroy-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gilroy-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gilroy-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gilroy-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
})

export const metadata: Metadata = {
  title: 'Long Bio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={gilroy.variable}>
        <section className="container max-w-[480px] mx-auto px-8">{children}</section>
      </body>
    </html>
  )
}
