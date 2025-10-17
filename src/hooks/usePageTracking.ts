import { useEffect } from 'react'
import { pageview } from '@/lib/gtag'
import { usePathname } from 'next/navigation'

export const usePageTracking = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Only track on client side
    if (typeof window !== 'undefined' && pathname) {
      pageview(pathname)
    }
  }, [pathname])
}
