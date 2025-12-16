'use client'

import Image from 'next/image'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

function PreviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || ''

  const handleGetStarted = () => {
    const nextUrl = name
      ? `/auth/username?name=${encodeURIComponent(name)}`
      : '/auth/username'
    router.push(nextUrl)
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="pt-8 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Bio Profile
        </h1>
        <p className="text-sm text-gray-600">
          Share your story with the world in a beautiful format
        </p>
      </div>

      {/* Image Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="relative mx-auto max-w-sm">
          {/* Phone mockup frame effect */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-900 bg-gray-900">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
            
            {/* Bio Preview Image */}
            <div className="relative w-full aspect-[9/19.5] bg-white">
              <Image
                src="/assets/images/preview.PNG"
                alt="Example Bio Profile"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -z-10 top-10 -left-4 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-60" />
          <div className="absolute -z-10 bottom-20 -right-4 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-60" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent">
        <Button
          onClick={handleGetStarted}
          className="w-full h-14 bg-purple-blaze hover:bg-purple-700 text-white text-lg font-bold rounded-full shadow-lg shadow-purple-300/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Let&apos;s Get Started
        </Button>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full w-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  )
}

