import { Vazirmatn } from 'next/font/google'

const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
})

export default function FaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={`${vazir.className}`}>{children}</div>
}

