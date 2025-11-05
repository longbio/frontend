'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import { useState, useRef } from 'react'
import html2canvas from '@html2canvas/html2canvas'
import {
  Download,
  Share2,
  X,
  Calendar,
  User,
  Heart,
  Venus,
  Mars,
  GraduationCap,
  Star,
  MapPin,
  PawPrint,
  CheckCircle,
  Dumbbell,
  Briefcase,
  Globe,
  Sparkles,
  Ruler,
} from 'lucide-react'
interface UserData {
  id: number
  username: string
  birthDate: string | null
  fullName: string
  gender: string
  maritalStatus: string
  educationalStatus: string
  profileImage: string
  isVerified?: boolean
  height: number
  weight: number
  bornPlace: string
  livePlace: string
  doesExercise: boolean
  favoriteSport: string[]
  travelStyle: string[]
  details: string
  education: {
    topic: string
    university: string
    graduationYear: string
  }
  job: {
    company: string
    position: string
  }
  pet: {
    name: string
    breed: string
  }
  skills: string[] | null
  interests: string[] | null
  visitedCountries: string[] | null
}

interface ShareScreenshotProps {
  userData: UserData
  onClose: () => void
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function ShareScreenshot({
  userData,
  onClose,
  onError,
  onSuccess,
}: ShareScreenshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const screenshotRef = useRef<HTMLDivElement>(null)

  const age = userData.birthDate
    ? new Date().getFullYear() - new Date(userData.birthDate).getFullYear()
    : null

  const skillMapping: { [key: string]: string } = {
    '1': 'Sports',
    '2': 'Painting',
    '3': 'Music',
    '4': 'Singing',
    '5': 'Cultural Travel',
    '6': 'Dancing',
    '7': 'Physics and Math',
    '8': 'Cooking',
    '9': 'Photography',
    '10': 'Road Trip',
    '11': 'Eco-Tourism',
  }

  const displaySkills = userData.skills?.map((skill) => skillMapping[skill] || skill) || []
  const displayInterests = userData.interests || []

  const generateScreenshot = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        setError('Browser environment not available')
        setIsGenerating(false)
        return
      }

      const element = screenshotRef.current
      if (!element) {
        setError('Screenshot content element not found')
        setIsGenerating(false)
        return
      }

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        width: 360,
        height: 600,
        windowWidth: 360,
        windowHeight: 600,
      })

      const dataURL = canvas.toDataURL('image/png', 1.0)
      setScreenshot(dataURL)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = `Failed to generate screenshot: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadScreenshot = () => {
    if (!screenshot) return
    if (typeof document === 'undefined') return

    const link = document.createElement('a')
    link.download = `${userData.username}-bio.png`
    link.href = screenshot
    link.click()
  }

  const shareScreenshot = async () => {
    if (!screenshot) return

    try {
      const response = await fetch(screenshot)
      const blob = await response.blob()
      const file = new File([blob], `${userData.username}-bio.png`, { type: 'image/png' })

      if (
        typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${userData.fullName}'s Bio`,
          text: `Check out ${userData.fullName}'s bio on LongBio!`,
          files: [file],
        })
      } else {
        downloadScreenshot()
      }
    } catch (error) {
      console.error('Error sharing screenshot:', error)
      downloadScreenshot()
    }
  }

  return (
    <>
      {/* Hidden screenshot content */}
      <div
        ref={screenshotRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '360px',
          height: '600px',
          overflow: 'hidden',
          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #9333ea',
          borderRadius: '0.625rem',
        }}
      >
        {/* Header - Full width purple bar */}
        <div
          style={{
            backgroundColor: '#9333ea',
            width: 'fit-content',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.7rem',
            paddingRight: '0.7rem',
            borderBottomLeftRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            }}
          >
            <Globe style={{ width: '0.875rem', height: '0.875rem', color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '0.025em',
              }}
            >
              Longbio.me
            </span>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          {/* Compact Header */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '0.625rem',
              padding: '0.75rem',
              marginBottom: '0.375rem',
              textAlign: 'center',
            }}
          >
            {/* Profile Picture and Info in two columns */}
            <div
              style={{
                display: 'inline-flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              {/* Left Column - Profile Picture */}
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    border: '3px solid #e9d5ff',
                    borderRadius: '50%',
                    padding: '0.125rem',
                    background: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #e9d5ff',
                    }}
                  >
                    {userData.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt="profile"
                        width={72}
                        height={72}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'linear-gradient(to bottom right, #f3e8ff, #fce7f3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User style={{ width: '2.25rem', height: '2.25rem', color: '#9333ea' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Name and Info */}
              <div style={{ flexShrink: 0 }}>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.375rem',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {userData.fullName}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    @{userData.username}
                  </span>
                  {userData.isVerified && (
                    <CheckCircle
                      style={{ width: '0.75rem', height: '0.75rem', color: '#3b82f6' }}
                    />
                  )}
                </div>

                {/* Compact badges */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  {age && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#fce7f3',
                        color: '#be185d',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        fontWeight: '500',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                        border: '1px solid #fbcfe8',
                      }}
                    >
                      <Calendar style={{ width: '0.75rem', height: '0.75rem', color: '#be185d' }} />
                      <span>{age}</span>
                    </div>
                  )}
                  {(userData.height > 0 || userData.weight > 0) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        fontWeight: '500',
                        gap: '0.25rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <Ruler style={{ width: '0.75rem', height: '0.75rem', color: '#1e40af' }} />
                      <span>
                        {userData.height > 0 ? userData.height + 'cm' : ''}
                        {userData.height > 0 && userData.weight > 0 && '/'}
                        {userData.weight > 0 ? userData.weight + 'kg' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Gender and Marital Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.6875rem',
                    color: '#6b7280',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {userData.gender && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {userData.gender.toLowerCase() === 'male' ? (
                        <Mars style={{ width: '0.75rem', height: '0.75rem', color: '#6b7280' }} />
                      ) : (
                        <Venus style={{ width: '0.75rem', height: '0.75rem', color: '#6b7280' }} />
                      )}
                      {userData.gender}
                    </span>
                  )}
                  {userData.maritalStatus && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Heart style={{ width: '0.75rem', height: '0.75rem', color: '#6b7280' }} />
                      {userData.maritalStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {(userData.bornPlace || userData.livePlace) && (
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.625rem',
                border: '1px solid #e5e7eb',
                padding: '0.5rem',
                marginBottom: '0.375rem',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                <MapPin style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                <h4
                  style={{
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    color: '#111827',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    lineHeight: '1',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Location
                </h4>
              </div>
              {userData.bornPlace && (
                <div
                  style={{
                    fontSize: '0.625rem',
                    color: '#374151',
                    marginBottom: '0.18rem',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  Born: {userData.bornPlace}
                </div>
              )}
              {userData.livePlace && (
                <div
                  style={{
                    fontSize: '0.625rem',
                    color: '#374151',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  Live: {userData.livePlace}
                </div>
              )}
            </div>
          )}

          {/* Compact Grid - 2 columns for better spacing */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.375rem',
              marginBottom: '0.375rem',
              marginLeft: '0',
              marginRight: '0',
              boxSizing: 'border-box',
              overflow: 'auto',
              width: '100%',
              minWidth: 0,
            }}
          >
            {/* Birth Date */}
            {userData.birthDate && (
              <div
                style={{
                  background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9d5ff',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                  gridColumn: !(userData.education.university || userData.job.position)
                    ? '1 / -1'
                    : 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Calendar style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Birth Date
                  </h4>
                </div>
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#374151',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    lineHeight: '1rem',
                  }}
                >
                  {dayjs(userData.birthDate).format('MMM DD, YYYY')}
                </p>
              </div>
            )}

            {/* Education */}
            {userData.education.university && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <GraduationCap
                    style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }}
                  />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Education
                  </h4>
                </div>
                {userData.education.university && (
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: '#374151',
                      marginBottom: '0.125rem',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    University: {userData.education.university}
                  </div>
                )}
                {userData.education.topic && (
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: '#374151',
                      marginBottom: '0.125rem',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Topic: {userData.education.topic}
                  </div>
                )}
                {userData.education.graduationYear && (
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: '#374151',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Graduation Year: {userData.education.graduationYear}
                  </div>
                )}
              </div>
            )}

            {/* Job */}
            {userData.job.position && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Briefcase style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Career
                  </h4>
                </div>
                <div
                  style={{
                    fontSize: '0.625rem',
                    color: '#374151',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    lineHeight: '1rem',
                  }}
                >
                  {userData.job.position}
                </div>
              </div>
            )}

            {/* Interests */}
            {displayInterests.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9d5ff',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                  gridColumn: !(userData.favoriteSport.length > 0 || displaySkills.length > 0)
                    ? '1 / -1'
                    : 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Star style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Interests
                  </h4>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.125rem',
                    lineHeight: '1rem',
                  }}
                >
                  {displayInterests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      style={{
                        paddingLeft: '0.375rem',
                        paddingRight: '0.375rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                        border: '1px solid #c084fc',
                        color: '#7e22ce',
                        borderRadius: '0.5rem',
                        fontSize: '0.625rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '1rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sports */}
            {userData.favoriteSport.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9d5ff',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                  gridColumn: !(displayInterests.length > 0 || displaySkills.length > 0)
                    ? '1 / -1'
                    : 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Dumbbell style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Sports
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.125rem' }}>
                  {userData.favoriteSport.slice(0, 3).map((sport, index) => (
                    <span
                      key={index}
                      style={{
                        paddingLeft: '0.375rem',
                        paddingRight: '0.375rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                        border: '1px solid #c084fc',
                        color: '#7e22ce',
                        borderRadius: '0.5rem',
                        fontSize: '0.625rem',
                        lineHeight: '1rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {displaySkills.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                  gridColumn: !(displayInterests.length > 0 || userData.favoriteSport.length > 0)
                    ? '1 / -1'
                    : 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Sparkles style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Skills
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.125rem' }}>
                  {displaySkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        paddingLeft: '0.375rem',
                        paddingRight: '0.375rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                        border: '1px solid #93c5fd',
                        color: '#1e40af',
                        borderRadius: '0.5rem',
                        fontSize: '0.625rem',
                        lineHeight: '1rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Travel */}
            {userData.travelStyle && userData.travelStyle.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <MapPin style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Travel Style
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.125rem' }}>
                  {userData.travelStyle.slice(0, 2).map((style, index) => (
                    <span
                      key={index}
                      style={{
                        paddingLeft: '0.375rem',
                        paddingRight: '0.375rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                        border: '1px solid #c084fc',
                        color: '#7e22ce',
                        borderRadius: '0.5rem',
                        fontSize: '0.625rem',
                        lineHeight: '1rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visited Countries */}
            {userData.visitedCountries && userData.visitedCountries.length > 0 && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <Globe style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Countries
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {userData.visitedCountries.slice(0, 5).map((country, index) => {
                    // Get country flag emoji (basic mapping for common countries)
                    const getCountryFlag = (countryName: string) => {
                      const flagMap: { [key: string]: string } = {
                        ایران: '🇮🇷',
                        iran: '🇮🇷',
                        ترکیه: '🇹🇷',
                        turkey: '🇹🇷',
                        دبی: '🇦🇪',
                        dubai: '🇦🇪',
                        امارات: '🇦🇪',
                        uae: '🇦🇪',
                        مالزی: '🇲🇾',
                        malaysia: '🇲🇾',
                        تایلند: '🇹🇭',
                        thailand: '🇹🇭',
                        سنگاپور: '🇸🇬',
                        singapore: '🇸🇬',
                        ژاپن: '🇯🇵',
                        japan: '🇯🇵',
                        کره: '🇰🇷',
                        korea: '🇰🇷',
                        چین: '🇨🇳',
                        china: '🇨🇳',
                        هند: '🇮🇳',
                        india: '🇮🇳',
                        روسیه: '🇷🇺',
                        russia: '🇷🇺',
                        آلمان: '🇩🇪',
                        germany: '🇩🇪',
                        فرانسه: '🇫🇷',
                        france: '🇫🇷',
                        ایتالیا: '🇮🇹',
                        italy: '🇮🇹',
                        اسپانیا: '🇪🇸',
                        spain: '🇪🇸',
                        انگلستان: '🇬🇧',
                        uk: '🇬🇧',
                        کانادا: '🇨🇦',
                        canada: '🇨🇦',
                        آمریکا: '🇺🇸',
                        usa: '🇺🇸',
                        استرالیا: '🇦🇺',
                        australia: '🇦🇺',
                      }
                      return flagMap[countryName.toLowerCase()] || '🏳️'
                    }
                    return (
                      <span
                        key={index}
                        style={{
                          fontSize: '1.25rem',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                        }}
                      >
                        {getCountryFlag(country)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pet */}
            {(userData.pet.name || userData.pet.breed) && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: '0.625rem',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  padding: '0.375rem',
                  boxSizing: 'border-box',
                  gridColumn: '1 / -1',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <PawPrint style={{ width: '0.875rem', height: '0.875rem', color: '#9333ea' }} />
                  <h4
                    style={{
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      color: '#111827',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      lineHeight: '1',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Pet
                  </h4>
                </div>
                <div
                  style={{
                    fontSize: '0.625rem',
                    color: '#374151',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1rem',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {userData.pet.name || userData.pet.breed}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div
          style={{
            backgroundColor: '#9333ea',
            textAlign: 'center',
            width: 'fit-content',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.7rem',
            paddingRight: '0.7rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderTopLeftRadius: '0.625rem',
            borderTopRightRadius: '0.625rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            }}
          >
            <Sparkles style={{ width: '0.875rem', height: '0.875rem', color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '0.025em',
              }}
            >
              Create your longBio and share it!
            </span>
          </div>
        </div>
      </div>

      {/* Modal UI */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-[23rem] max-h-[170vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-1 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Share Bio Screenshot</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[calc(170vh)] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-500 text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {!screenshot ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Beautiful Screenshot
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Generate a stunning screenshot of {userData.fullName}&apos;s bio to share with
                    friends
                  </p>
                </div>

                <button
                  onClick={generateScreenshot}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      Generate Screenshot
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Preview */}
                <div className="flex justify-center">
                  <div
                    className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    style={{ width: '350px', maxWidth: '350px' }}
                  >
                    <Image src={screenshot} alt="Bio Screenshot" width={350} height={600} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadScreenshot}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  >
                    <Download className="size-4" />
                  </button>
                  <button
                    onClick={shareScreenshot}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
