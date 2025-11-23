'use client'
import dynamic from 'next/dynamic'
import { trackBioEvent } from '@/lib/gtag'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { usePageTracking } from '@/hooks/usePageTracking'
import type { GetUserByIdResponse } from '@/service/user/type'
import BioDisplay from '../components/BioDisplay'

const ClientOnlyBioContent = dynamic(() => Promise.resolve(BioContent), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function BioContent({ username }: { username: string }) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userData, setUserData] = useState<GetUserByIdResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track page views
  usePageTracking()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const userResponse = await fetch(`${apiUrl}/v1/users/${username}`, {
          credentials: 'include',
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserData(userData.data)
          if (userData.data.profileImage) {
            setProfileImage(userData.data.profileImage)
          }
        } else {
          let errorMessage = 'Failed to load user data. Please try again.'

          try {
            const errorData = await userResponse.json()
            if (errorData.message) {
              errorMessage = errorData.message
            } else if (errorData.error) {
              errorMessage = errorData.error
            }
          } catch {
            if (userResponse.status === 404) {
              errorMessage = 'User not found. Please check the username.'
            } else if (userResponse.status === 500) {
              errorMessage = 'Server error. Please try again later.'
            } else if (userResponse.status === 403) {
              errorMessage = 'Access denied. You do not have permission to view this profile.'
            } else if (userResponse.status === 400) {
              errorMessage = 'Invalid request. Please check the username format.'
            }
          }

          setError(errorMessage)
          setUserData(null)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Connection error. Please check your internet connection.')
        setUserData(null)
        setLoading(false)
      }
    }

    if (username) {
      fetchUserData()
    }
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-blaze mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData && error) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Profile Data</h2>
          <p className="text-gray-600 mb-4">
            {!process.env.NEXT_PUBLIC_API_BASE_URL
              ? 'API configuration error. Please check your environment variables.'
              : 'No profile data available. Please complete your profile setup.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <BioDisplay
      userData={userData}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
      username={username}
      onGetStartedClick={() => {
        trackBioEvent('get_started_click', {
          source: 'public_bio',
          username: username,
        })
      }}
    />
  )
}

export default function Bio() {
  const params = useParams<{ username: string }>()
  const username = params?.username || ''
  return <ClientOnlyBioContent username={username} />
}
