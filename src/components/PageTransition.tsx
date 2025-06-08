'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    if (prevPath !== pathname) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setPrevPath(pathname)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, prevPath])

  return (
    <div
      className={`fixed inset-0 transition-transform duration-200 ease-in-out ${
        isAnimating ? 'translate-x-[-100%]' : 'translate-x-0'
      }`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 50,
      }}
    >
      {children}
    </div>
  )
}
