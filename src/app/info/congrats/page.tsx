'use client'

import React, { Suspense } from 'react'
import Header from '@/components/Header'
import Congrats from './components/congrats'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

function CongratsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-white">
      <div className="flex flex-col items-center">
        <Header />
        <div className="flex flex-col items-center w-full mt-12">
          <div className="text-lg font-bold text-center">
            <div className="flex justify-center gap-x-2">
              <h1 className="text-gray-500">
                <span className="text-black">“</span>🎉Congrats
              </h1>
              <h2 className="text-xl text-black">{name}!</h2>
            </div>
            <h3 className="text-base">
              Your profile is ready. You can now share it on social media and with your friends.”
            </h3>
          </div>
          <Congrats />
          <h1 className="text-xl font-bold text-center mt-2">Congrats !</h1>
        </div>
      </div>
      <Button
        className="sticky bottom-0 w-full h-fit bg-purple-blaze rounded-full"
        onClick={() => {
          router.push('/bio')
        }}
      >
        View My Profile!
      </Button>
    </div>
  )
}

export default function CongratsPage() {
  return (
    <Suspense>
      <CongratsContent />
    </Suspense>
  )
}
