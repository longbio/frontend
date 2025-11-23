'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import html2canvas from '@html2canvas/html2canvas'
import { useFlagCountries } from '@/service/countries'
import { useState, useRef, useMemo, ReactNode, CSSProperties } from 'react'
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
  onScreenshotReady?: (screenshot: string) => void
}

export default function ShareScreenshot({
  userData,
  onClose,
  onError,
  onSuccess,
  onScreenshotReady,
}: ShareScreenshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const screenshotRef = useRef<HTMLDivElement>(null)
  const { data: flagCountries, loading: flagLoading } = useFlagCountries()
  const flagEmojiMap = useMemo(() => {
    const map = new Map<string, string>()
    flagCountries?.forEach((item) => {
      const normalizedName = item.name.trim().toLowerCase()
      map.set(normalizedName, item.emoji || '')
    })
    return map
  }, [flagCountries])

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

  const skillEmojiMap: { [key: string]: string } = {
    'Sports': '⚽',
    'Painting': '🎨',
    'Music': '🎵',
    'Singing': '🎤',
    'Cultural Travel': '🏛️',
    'Dancing': '💃',
    'Physics and Math': '🔬',
    'Cooking': '👨‍🍳',
    'Photography': '📸',
    'Road Trip': '🛣️',
    'Eco-Tourism': '🌿',
  }

  const getInterestEmoji = (interest: string): string => {
    const lowerInterest = interest.toLowerCase()
    const interestEmojiMap: { [key: string]: string } = {
      'travelling': '✈️',
      'traveling': '✈️',
      'cooking': '👨‍🍳',
      'books': '📚',
      'reading': '📖',
      'coffee': '☕',
      'movies': '🎬',
      'series': '📺',
      'music': '🎵',
      'volunteering': '🤝',
      'friends': '👥',
      'social media': '📱',
      'flowers': '🌸',
      'gardening': '🌱',
      'sports': '⚽',
      'gym': '💪',
      'meditation': '🧘',
      'photography': '📸',
      'art': '🎨',
      'technology': '💻',
      'gaming': '🎮',
      'fitness': '💪',
      'dancing': '💃',
      'yoga': '🧘',
      'hiking': '🥾',
      'swimming': '🏊',
      'cycling': '🚴',
      'running': '🏃',
    }
    
    for (const [key, emoji] of Object.entries(interestEmojiMap)) {
      if (lowerInterest.includes(key)) {
        return emoji
      }
    }
    return '⭐'
  }

  const getSportEmoji = (sport: string): string => {
    const lowerSport = sport.toLowerCase()
    const sportEmojiMap: { [key: string]: string } = {
      'football': '⚽',
      'soccer': '⚽',
      'basketball': '🏀',
      'tennis': '🎾',
      'volleyball': '🏐',
      'baseball': '⚾',
      'swimming': '🏊',
      'cycling': '🚴',
      'running': '🏃',
      'golf': '⛳',
      'boxing': '🥊',
      'martial arts': '🥋',
      'yoga': '🧘',
      'gymnastics': '🤸',
      'skiing': '⛷️',
      'snowboarding': '🏂',
      'surfing': '🏄',
      'diving': '🤿',
      'archery': '🏹',
      'fencing': '🤺',
      'weightlifting': '🏋️',
      'wrestling': '🤼',
      'badminton': '🏸',
      'table tennis': '🏓',
      'ping pong': '🏓',
      'cricket': '🏏',
      'hockey': '🏒',
      'rugby': '🏉',
      'handball': '🤾',
      'water polo': '🤽',
      'rowing': '🚣',
      'sailing': '⛵',
      'climbing': '🧗',
      'rock climbing': '🧗',
      'skateboarding': '🛹',
      'esports': '🎮',
      'chess': '♟️',
      'dance': '💃',
    }
    
    for (const [key, emoji] of Object.entries(sportEmojiMap)) {
      if (lowerSport.includes(key)) {
        return emoji
      }
    }
    return '🏅'
  }

  const fullName = userData?.fullName?.trim() || 'LongBio User'
  const username = userData?.username?.trim() || 'user'
  const profileImage = userData?.profileImage?.trim() || null
  const isVerified = Boolean(userData?.isVerified)

  const rawSkills = Array.isArray(userData?.skills)
    ? userData.skills.filter((skill): skill is string => Boolean(skill && String(skill).trim()))
    : []
  const displaySkills = rawSkills
    .map((skill) => skillMapping[skill] || skill)
    .filter((skill): skill is string => Boolean(skill && String(skill).trim()))

  const displayInterests = Array.isArray(userData?.interests)
    ? userData.interests.filter((interest): interest is string =>
        Boolean(interest && interest.trim())
      )
    : []

  const favoriteSports = Array.isArray(userData?.favoriteSport)
    ? userData.favoriteSport.filter((sport): sport is string => Boolean(sport && sport.trim()))
    : []

  const travelStyles = Array.isArray(userData?.travelStyle)
    ? userData.travelStyle.filter((style): style is string => Boolean(style && style.trim()))
    : []

  const visitedCountries = Array.isArray(userData?.visitedCountries)
    ? userData.visitedCountries.filter((country): country is string =>
        Boolean(country && country.trim())
      )
    : []

  const education = userData?.education ?? { topic: '', university: '', graduationYear: '' }
  const educationTopic = education?.topic?.trim() || ''
  const educationUniversity = education?.university?.trim() || ''
  const educationGraduationYear = education?.graduationYear?.trim() || ''
  const job = userData?.job ?? { company: '', position: '' }
  const jobPosition = job?.position?.trim() || ''
  const jobCompany = job?.company?.trim() || ''
  const pet = userData?.pet ?? { name: '', breed: '' }
  const petName = pet?.name?.trim() || ''
  const petBreed = pet?.breed?.trim() || ''
  const bornPlace = userData?.bornPlace?.trim() || ''
  const livePlace = userData?.livePlace?.trim() || ''
  const gender = userData?.gender?.trim() || ''
  const genderLower = gender.toLowerCase()
  const maritalStatus = userData?.maritalStatus?.trim() || ''
  const educationalStatus = userData?.educationalStatus?.trim() || ''
  const doesExercise =
    typeof userData?.doesExercise === 'boolean' ? Boolean(userData.doesExercise) : null
  const heightValue =
    typeof userData?.height === 'number' && userData.height > 0 ? userData.height : null
  const weightValue =
    typeof userData?.weight === 'number' && userData.weight > 0 ? userData.weight : null
  const birthDateValue =
    userData?.birthDate && dayjs(userData.birthDate).isValid() ? dayjs(userData.birthDate) : null
  const age = birthDateValue ? dayjs().diff(birthDateValue, 'year') : null
  const clampTwoLineTextStyle: CSSProperties = {
    fontSize: '0.385rem',
    color: '#374151',
    lineHeight: '0.75rem',
    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
  }

  const generateScreenshot = async () => {
    setIsGenerating(true)
    setIsPreviewLoading(false)
    setScreenshot(null)
    setError(null)

    try {
      if (flagLoading) {
        setError('Please wait until country flags finish loading.')
        setIsGenerating(false)
        return
      }
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
        scale: 8,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        width: 355,
        height: 600,
        windowWidth: 355,
        windowHeight: 600,
      })

      const dataURL = canvas.toDataURL('image/png', 1.0)
      setScreenshot(dataURL)
      setIsPreviewLoading(true)

      if (onSuccess) {
        onSuccess()
      }
      if (onScreenshotReady) {
        onScreenshotReady(dataURL)
      }
    } catch (error) {
      const errorMessage = `Failed to generate screenshot: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }
      setIsGenerating(false)
    }
  }

  const handlePreviewLoaded = () => {
    setIsPreviewLoading(false)
    setIsGenerating(false)
  }

  const downloadScreenshot = () => {
    if (!screenshot) return
    if (typeof document === 'undefined') return

    const link = document.createElement('a')
    link.download = `${username}-LONGBIO-SCREENSHOT.png`
    link.href = screenshot
    link.click()
  }

  const shareScreenshot = async () => {
    if (!screenshot) return

    try {
      const response = await fetch(screenshot)
      const blob = await response.blob()
      const file = new File([blob], `${username}-LONGBIO-SCREENSHOT.png`, { type: 'image/png' })

      if (
        typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${fullName}'s Bio`,
          text: `Check out ${fullName}'s bio on LongBio!`,
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
          width: '355px',
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
        {/* Header - Gradient badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #dd2a7b 0%, #8134af 100%)',
            width: '14.2rem',
            paddingTop: '0.35rem',
            paddingBottom: '0.35rem',
            paddingLeft: '0.595rem',
            paddingRight: '0.595rem',
            borderBottomLeftRadius: '0.77rem',
            borderBottomRightRadius: '0.77rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.315rem',
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '0.945rem',
                height: '0.945rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                boxShadow: '0 8px 16px -10px rgba(59, 130, 246, 0.45)',
              }}
            >
              <Globe style={{ width: '0.56rem', height: '0.56rem', color: '#f5f3ff' }} />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.105rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.56rem',
                  fontWeight: 700,
                  color: '#f5f3ff',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                LongBio.me
              </span>
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
              padding: '0.525rem',
              marginBottom: '0.1925rem',
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
              <div style={{ flexShrink: 0, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
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
                    {profileImage ? (
                      <Image
                        src={profileImage}
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
              <div style={{ flexShrink: 0, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                <h3
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.2625rem',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {fullName}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    gap: '0.175rem',
                    marginBottom: '0.2625rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.58rem',
                      color: '#6b7280',
                      fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    @{username}
                  </span>
                  {isVerified && (
                    <CheckCircle
                      style={{ width: '0.525rem', height: '0.525rem', color: '#3b82f6' }}
                    />
                  )}
                </div>

                {/* Compact badges */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.175rem',
                    marginBottom: '0.224rem',
                  }}
                >
                  {age !== null && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.175rem',
                        backgroundColor: '#fce7f3',
                        color: '#be185d',
                        paddingLeft: '0.35rem',
                        paddingRight: '0.35rem',
                        paddingTop: '0.175rem',
                        paddingBottom: '0.175rem',
                        borderRadius: '9999px',
                        fontSize: '0.48rem',
                        fontWeight: '500',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                        border: '1px solid #fbcfe8',
                      }}
                    >
                      <Calendar style={{ width: '0.525rem', height: '0.525rem', color: '#be185d' }} />
                      <span>{age}</span>
                    </div>
                  )}
                  {(heightValue || weightValue) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        paddingLeft: '0.35rem',
                        paddingRight: '0.35rem',
                        paddingTop: '0.175rem',
                        paddingBottom: '0.175rem',
                        borderRadius: '9999px',
                        fontSize: '0.48rem',
                        fontWeight: '500',
                        gap: '0.175rem',
                        fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <Ruler style={{ width: '0.525rem', height: '0.525rem', color: '#1e40af' }} />
                      <span>
                        {heightValue ? `${heightValue}cm` : ''}
                        {heightValue && weightValue && '/'}
                        {weightValue ? `${weightValue}kg` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Gender and Marital Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'left',
                    gap: '0.35rem',
                    fontSize: '0.53rem',
                    color: '#6b7280',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {gender && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.175rem' }}>
                      {genderLower === 'male' || genderLower === 'مرد' ? (
                        <Mars style={{ width: '0.525rem', height: '0.525rem', color: '#6b7280' }} />
                      ) : (
                        <Venus style={{ width: '0.525rem', height: '0.525rem', color: '#6b7280' }} />
                      )}
                      {gender}
                    </span>
                  )}
                  {maritalStatus && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.175rem' }}>
                      <Heart style={{ width: '0.525rem', height: '0.525rem', color: '#6b7280' }} />
                      {maritalStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {(bornPlace || livePlace) && (
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.4375rem',
                border: '1px solid #e5e7eb',
                padding: '0.35rem',
                marginBottom: '0.2625rem',
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
                  gap: '0.175rem',
                  marginBottom: '0.175rem',
                }}
              >
                <MapPin style={{ width: '0.6125rem', height: '0.6125rem', color: '#9333ea' }} />
                <h4
                  style={{
                    fontWeight: '700',
                    fontSize: '0.58rem',
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
              {bornPlace && (
                <div
                  style={{
                    fontSize: '0.48rem',
                    color: '#374151',
                    marginBottom: '0.126rem',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  Born: {bornPlace}
                </div>
              )}
              {livePlace && (
                <div
                  style={{
                    fontSize: '0.48rem',
                    color: '#374151',
                    fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                  }}
                >
                  Live: {livePlace}
                </div>
              )}
            </div>
          )}

         {(() => {
            const cardBlocks: { key: string; content: ReactNode }[] = []

            // if (birthDateValue) {
            //   cardBlocks.push({
            //     key: 'birth',
            //     content: (
            //       <>
            //         <div
            //           style={{
            //             display: 'flex',
            //             alignItems: 'center',
            //             gap: '0.2rem',
            //             marginBottom: '0.275rem',
            //           }}
            //         >
            //           <Calendar style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
            //           <h4
            //             style={{
            //               fontWeight: '700',
            //               fontSize: '0.35rem',
            //               color: '#111827',
            //               fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            //               lineHeight: '0.6',
            //               margin: 0,
            //               padding: 0,
            //             }}
            //           >
            //             Birth Date
            //           </h4>
            //         </div>
            //         <p style={clampTwoLineTextStyle}>{birthDateValue.format('MMM DD, YYYY')}</p>
            //       </>
            //     ),
            //   })
            // }

            if (educationUniversity) {
              cardBlocks.push({
                key: 'education',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <GraduationCap
                        style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }}
                      />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
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
                    {educationalStatus && (
                      <div
                        style={{
                          ...clampTwoLineTextStyle,
                          marginBottom:
                            educationUniversity || educationTopic || educationGraduationYear
                              ? '0.088rem'
                              : 0,
                        }}
                      >
                        Status:{' '}
                        <span style={{ textTransform: 'capitalize' }}>{educationalStatus}</span>
                      </div>
                    )}
                    {educationUniversity && (
                      <div
                        style={{
                          ...clampTwoLineTextStyle,
                          marginBottom: educationTopic ? '0.088rem' : 0,
                        }}
                      >
                        University: {educationUniversity}
                      </div>
                    )}
                    {educationTopic && (
                      <div
                        style={{
                          ...clampTwoLineTextStyle,
                          marginBottom: educationGraduationYear ? '0.088rem' : 0,
                        }}
                      >
                        Topic: {educationTopic}
                      </div>
                    )}
                    {educationGraduationYear && (
                      <div style={clampTwoLineTextStyle}>
                        Graduation Year: {educationGraduationYear}
                      </div>
                    )}
                  </>
                ),
              })
            }

            if (jobPosition) {
              cardBlocks.push({
                key: 'career',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <Briefcase
                        style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }}
                      />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
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
                    <div style={clampTwoLineTextStyle}>{jobPosition}</div>
                    {jobCompany && (
                      <div
                        style={{
                          ...clampTwoLineTextStyle,
                          marginTop: '0.11rem',
                        }}
                      >
                        Company: {jobCompany}
                      </div>
                    )}
                  </>
                ),
              })
            }

            if (visitedCountries.length > 0) {
              const maxCountries = 8
              const displayedCountries = visitedCountries.slice(0, maxCountries)
              const remainingCount = visitedCountries.length - maxCountries
              cardBlocks.push({
                key: 'countries',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <Globe style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
                          color: '#111827',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          lineHeight: '1',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        Visited Countries
                      </h4>
                      <span
                        style={{
                          fontSize: '0.385rem',
                          color: '#6b7280',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          marginLeft: '0.1rem',
                        }}
                      >
                        ({visitedCountries.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', alignItems: 'center' }}>
                      {displayedCountries.map((country, index) => {
                        const getCountryFlag = (countryName: string) => {
                          const normalizedName = countryName.trim().toLowerCase()
                          if (!normalizedName) return '🏳️'

                          const directMatch = flagEmojiMap.get(normalizedName)
                          if (directMatch) return directMatch

                          const flagMap: { [key: string]: string } = {
                            ایران: '🇮🇷',
                            'جمهوری اسلامی ایران': '🇮🇷',
                            iran: '🇮🇷',
                            'islamic republic of iran': '🇮🇷',
                            ترکیه: '🇹🇷',
                            turkey: '🇹🇷',
                            دبی: '🇦🇪',
                            dubai: '🇦🇪',
                            امارات: '🇦🇪',
                            'امارات متحده عربی': '🇦🇪',
                            uae: '🇦🇪',
                            'united arab emirates': '🇦🇪',
                            'united arab em': '🇦🇪',
                            مالزی: '🇲🇾',
                            malaysia: '🇲🇾',
                            تایلند: '🇹🇭',
                            thailand: '🇹🇭',
                            سنگاپور: '🇸🇬',
                            singapore: '🇸🇬',
                            ژاپن: '🇯🇵',
                            japan: '🇯🇵',
                            کره: '🇰🇷',
                            'کره جنوبی': '🇰🇷',
                            korea: '🇰🇷',
                            'south korea': '🇰🇷',
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
                            بریتانیا: '🇬🇧',
                            uk: '🇬🇧',
                            'united kingdom': '🇬🇧',
                            کانادا: '🇨🇦',
                            canada: '🇨🇦',
                            آمریکا: '🇺🇸',
                            usa: '🇺🇸',
                            'united states': '🇺🇸',
                            استرالیا: '🇦🇺',
                            australia: '🇦🇺',
                            قطر: '🇶🇦',
                            qatar: '🇶🇦',
                            عمان: '🇴🇲',
                            oman: '🇴🇲',
                            بحرین: '🇧🇭',
                            bahrain: '🇧🇭',
                            کویت: '🇰🇼',
                            kuwait: '🇰🇼',
                            عربستان: '🇸🇦',
                            'عربستان سعودی': '🇸🇦',
                            'saudi arabia': '🇸🇦',
                          }

                          if (flagMap[normalizedName]) return flagMap[normalizedName]

                          const simplified = normalizedName
                            .replace(/[^\p{L}\s]/gu, '')
                            .replace(/\s+/g, ' ')
                            .trim()
                          for (const [name, emoji] of flagEmojiMap) {
                            const simplifiedMapName = name
                              .replace(/[^\p{L}\s]/gu, '')
                              .replace(/\s+/g, ' ')
                              .trim()
                            if (simplified && simplified === simplifiedMapName) {
                              return emoji
                            }
                          }

                          return '🏳️'
                        }
                        return (
                          <span
                            key={index}
                            style={{
                              fontSize: '1.1rem',
                              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            }}
                          >
                            {getCountryFlag(country)}
                          </span>
                        )
                      })}
                      {remainingCount > 0 && (
                        <span
                          style={{
                            fontSize: '0.385rem',
                            color: '#6b7280',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            opacity: 0.7,
                          }}
                        >
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </>
                ),
              })
            }

            if (favoriteSports.length > 0) {
              const maxSports = 8
              const displayedSports = favoriteSports.slice(0, maxSports)
              const remainingCount = favoriteSports.length - maxSports
              cardBlocks.push({
                key: 'sports',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <Dumbbell style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
                          color: '#111827',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          lineHeight: '1',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        Sports
                      </h4>
                      <span
                        style={{
                          fontSize: '0.385rem',
                          color: '#6b7280',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          marginLeft: '0.1rem',
                        }}
                      >
                        ({favoriteSports.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.08rem' }}>
                      {displayedSports.map((sport, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {getSportEmoji(sport)} {sport}
                        </span>
                      ))}
                      {remainingCount > 0 && (
                        <span
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            opacity: 0.7,
                          }}
                        >
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                    {doesExercise !== null && (
                      <div
                        style={{
                          fontSize: '0.385rem',
                          color: '#374151',
                          marginTop: displayedSports.length ? '0.165rem' : 0,
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                        }}
                      >
                        Exercise: {doesExercise ? 'Yes' : 'No'}
                      </div>
                    )}
                  </>
                ),
              })
            }

            if (displaySkills.length > 0) {
              const maxSkills = 10
              const displayedSkills = displaySkills.slice(0, maxSkills)
              const remainingCount = displaySkills.length - maxSkills
              cardBlocks.push({
                key: 'skills',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <Sparkles style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
                          color: '#111827',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          lineHeight: '1',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        Skills
                      </h4>
                      <span
                        style={{
                          fontSize: '0.385rem',
                          color: '#6b7280',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          marginLeft: '0.1rem',
                        }}
                      >
                        ({displaySkills.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.08rem' }}>
                      {displayedSkills.map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #93c5fd',
                            color: '#1e40af',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {skillEmojiMap[skill] || '✨'} {skill}
                        </span>
                      ))}
                      {remainingCount > 0 && (
                        <span
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #93c5fd',
                            color: '#1e40af',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            opacity: 0.7,
                          }}
                        >
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </>
                ),
              })
            }

            if (displayInterests.length > 0) {
              const maxInterests = 7
              const displayedInterests = displayInterests.slice(0, maxInterests)
              const remainingCount = displayInterests.length - maxInterests
              cardBlocks.push({
                key: 'interests',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <Star style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
                          color: '#111827',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          lineHeight: '1',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        Interests
                      </h4>
                      <span
                        style={{
                          fontSize: '0.385rem',
                          color: '#6b7280',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          marginLeft: '0.1rem',
                        }}
                      >
                        ({displayInterests.length})
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.08rem',
                        lineHeight: '0.75rem',
                      }}
                    >
                      {displayedInterests.map((interest, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            whiteSpace: 'nowrap',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {getInterestEmoji(interest)} {interest}
                        </span>
                      ))}
                      {remainingCount > 0 && (
                        <span
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            whiteSpace: 'nowrap',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            opacity: 0.7,
                          }}
                        >
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </>
                ),
              })
            }

            if (travelStyles.length > 0) {
              const maxTravelStyles = 7
              const displayedTravelStyles = travelStyles.slice(0, maxTravelStyles)
              const remainingCount = travelStyles.length - maxTravelStyles
              cardBlocks.push({
                key: 'travel',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <MapPin style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
                          color: '#111827',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          lineHeight: '1',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        Travel Style
                      </h4>
                      <span
                        style={{
                          fontSize: '0.385rem',
                          color: '#6b7280',
                          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          marginLeft: '0.1rem',
                        }}
                      >
                        ({travelStyles.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.08rem' }}>
                      {displayedTravelStyles.map((style, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {style}
                        </span>
                      ))}
                      {remainingCount > 0 && (
                        <span
                          style={{
                            padding: '0.08rem 0.25rem',
                            border: '1px solid #c084fc',
                            color: '#7e22ce',
                            borderRadius: '0.4rem',
                            fontSize: '0.385rem',
                            lineHeight: '0.75rem',
                            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
                            opacity: 0.7,
                          }}
                        >
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </>
                ),
              })
            }

            if (petName || petBreed) {
              cardBlocks.push({
                key: 'pet',
                content: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginBottom: '0.3025rem',
                      }}
                    >
                      <PawPrint style={{ width: '0.75rem', height: '0.75rem', color: '#9333ea' }} />
                      <h4
                        style={{
                          fontWeight: '700',
                          fontSize: '0.53rem',
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
                    <div style={clampTwoLineTextStyle}>{petName || petBreed}</div>
                  </>
                ),
              })
            }

            if (!cardBlocks.length) {
              return null
            }

            const gradientTheme = {
              background: 'linear-gradient(120deg, #f3e8ff 0%, #fce7f3 100%)',
              border: '#e9d5ff',
            }
            const whiteTheme = {
              background: '#ffffff',
              border: '#e5e7eb',
            }

            // Helper function to get card theme based on index
            // Pattern: [gradient, white], [white, gradient], [gradient, white], ...
            const getCardTheme = (index: number) => {
              const pairIndex = Math.floor(index / 2)
              const positionInPair = index % 2
              // If pair index and position in pair have same parity, use gradient; otherwise white
              const isGradient = pairIndex % 2 === positionInPair
              return isGradient ? gradientTheme : whiteTheme
            }

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gridAutoRows: 'minmax(0, 1fr)',
                  gridAutoFlow: 'row dense',
                  gap: '0.22rem',
                  marginBottom: '0.33rem',
                  marginLeft: '0',
                  marginRight: '0',
                  boxSizing: 'border-box',
                  overflow: 'auto',
                  width: '100%',
                }}
              >
                {cardBlocks.map((card, index) => {
                  const theme = getCardTheme(index)
                  return (
                    <div
                      key={`${card.key}-${index}`}
                      style={{
                        background: theme.background,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.5rem',
                        padding: '0.33rem',
                        boxSizing: 'border-box',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                        gridColumn: 'span 1',
                        minHeight: 0,
                      }}
                    >
                      {card.content}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
        {/* Footer */}
        <div
          style={{
            background: 'linear-gradient(135deg, #dd2a7b 0%, #8134af 100%)',
            width: 'fit-content',
            paddingTop: '0.35rem',
            paddingBottom: '0.35rem',
            paddingLeft: '0.595rem',
            paddingRight: '0.595rem',
            borderTopLeftRadius: '0.77rem',
            borderTopRightRadius: '0.77rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.315rem',
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '0.945rem',
                height: '0.945rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                boxShadow: '0 8px 16px -10px rgba(59, 130, 246, 0.45)',
              }}
            >
              <Sparkles style={{ width: '0.56rem', height: '0.56rem', color: '#f5f3ff' }} />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.105rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.56rem',
                  fontWeight: 700,
                  color: '#f5f3ff',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Create your longBio and share it!
              </span>
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
                    Generate a stunning screenshot of {fullName}&apos;s bio to share with friends
                  </p>
                </div>

                <button
                  onClick={generateScreenshot}
                  disabled={isGenerating || flagLoading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating your Long bio photo...
                    </>
                  ) : flagLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Preparing...
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
                    <div className="relative">
                      <Image
                        src={screenshot || ''}
                        alt="Bio Screenshot"
                        width={350}
                        height={600}
                        onLoadingComplete={handlePreviewLoaded}
                      />
                      {(isGenerating || isPreviewLoading) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                        </div>
                      )}
                    </div>
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
