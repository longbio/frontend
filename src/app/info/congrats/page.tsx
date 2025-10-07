'use client'

import React from 'react'
import Header from '@/components/Header'
import Congrats from './components/congrats'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CongratsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const [userId, setUserId] = React.useState<string>('')

  React.useEffect(() => {
    // Get user ID from API only
    const getUserData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await fetch(`${apiUrl}/v1/users/me`, { credentials: 'include' })
        if (response.ok) {
          const userData = await response.json()
          setUserId(userData.data.id.toString())
        } else {
          console.error('Failed to get user data from API')
        }
      } catch (error) {
        console.error('Error getting user ID:', error)
      }
    }

    getUserData()
  }, [])

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
          <span className="text-xs font-light text-center text-black mt-4">
            Blah Blah Blah Blah Blah Blah Blah Blah
          </span>
        </div>
      </div>
      <Button
        className="sticky bottom-0 w-full h-fit bg-purple-blaze rounded-full"
        onClick={() => {
          if (userId) {
            router.push(`/bio/${userId}`)
          } else {
            console.error('User ID not available')
          }
        }}
        disabled={!userId}
      >
        {userId ? 'View My Profile!' : 'Loading...'}
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
