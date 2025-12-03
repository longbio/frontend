'use client'
import dayjs from 'dayjs'
import Image from 'next/image'
// import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
// import petPic from '/assets/images/pet.png'
import { Button } from '@/components/ui/button'
import ImageUploader from './components/ImageUploader'
import { useFlagCountries } from '@/service/countries'
import { useGetCurrentUser } from '@/service/user/hook'
import { usePageTracking } from '@/hooks/usePageTracking'
import { submitWaitlistServerAction } from '@/lib/server-action/user-actions'

const ShareModal = dynamic(() => import('./components/ShareModal'), {
  ssr: false,
})

const ShareScreenshot = dynamic(() => import('./components/ShareScreenshot'), {
  ssr: false,
})
// import type { GetUserByIdResponse } from '@/service/user/type'
import { trackShareAction, trackEditAction, trackPremiumSignup } from '@/lib/gtag'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  MapPin,
  Calendar,
  Ruler,
  Edit3,
  User,
  Heart,
  Users,
  Venus,
  Mars,
  GraduationCap,
  Dumbbell,
  Star,
  PawPrint,
  BookOpen,
  Share2,
  Camera,
  Crown,
  CheckCircle,
} from 'lucide-react'

const ClientOnlyBioContent = dynamic(() => Promise.resolve(BioContent), {
  ssr: false,
})

function BioContent() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showShareScreenshot, setShowShareScreenshot] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false)
  const [isWaitlistSuccess, setIsWaitlistSuccess] = useState(false)
  const [waitlistError, setWaitlistError] = useState('')
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false)
  const router = useRouter()

  // Track page views
  usePageTracking()

  const { data: currentUserResponse, isLoading: loading } = useGetCurrentUser()
  const { data: countriesData } = useFlagCountries()

  const userData = currentUserResponse?.data || null

  useEffect(() => {
    if (userData?.profileImage) {
      setProfileImage(userData.profileImage)
    }
  }, [userData])

  const handleEditSection = (section: string) => {
    // Track edit action
    trackEditAction(section)

    const stepMap: { [key: string]: string } = {
      personal: '/info/birthday',
      gender: '/info/gender',
      marital: '/info/marital',
      physical: '/info/physical',
      country: '/info/born',
      education: '/info/education',
      job: '/info/jobs',
      interests: '/info/interest',
      skills: '/info/skill',
      sports: '/info/sport',
      travel: '/info/travel',
      pet: '/info/pets',
      profile: '/info/set-profile',
      details: '/info/more-detail',
    }

    const stepUrl = stepMap[section]
    if (stepUrl) {
      router.push(stepUrl)
    }
  }

  const handleScreenshot = () => {
    // Track screenshot action
    trackShareAction('screenshot')
    setShowShareScreenshot(true)
  }

  const handlePremiumSubmit = async () => {
    if (!email && !phone) {
      setWaitlistError('Please enter either email or phone number')
      return
    }

    setWaitlistError('')
    setIsSubmittingWaitlist(true)

    try {
      await submitWaitlistServerAction({ email, phone })
      const method = email ? 'email' : 'phone'
      trackPremiumSignup(method)
      setIsWaitlistSuccess(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit waitlist. Please try again.'
      setWaitlistError(errorMessage)
    } finally {
      setIsSubmittingWaitlist(false)
    }
  }

  const handleWaitlistDialogClose = () => {
    setIsWaitlistDialogOpen(false)
    setIsWaitlistSuccess(false)
    setEmail('')
    setPhone('')
    setWaitlistError('')
  }

  const handleWaitlistDialogOpenChange = (open: boolean) => {
    setIsWaitlistDialogOpen(open)
    if (!open) {
      setIsWaitlistSuccess(false)
      setEmail('')
      setPhone('')
      setWaitlistError('')
    }
  }

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

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-500 ">
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

  const age = userData.birthDate
    ? new Date().getFullYear() - new Date(userData.birthDate).getFullYear()
    : null

  // Mapping for skills and interests IDs to actual names
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

  const stripEmoji = (text: string): string => {
    // Remove emojis including sequences with zero-width joiners
    // Pattern matches emoji sequences: base emoji + optional ZWJ + optional modifiers
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{24C2}-\u{1F251}]|[\u{1FA00}-\u{1FAFF}]|[\u{200D}]/gu, '').replace(/\s+/g, ' ').trim()
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

  // Convert ID arrays to actual names or use direct values if they're already strings
  const displaySkills = userData.skills?.map((skill) => skillMapping[skill] || skill) || []
  const displayInterests = userData.interests || []

  // Debug location data
  console.log('Location Debug:', {
    bornPlace: userData.bornPlace,
    livePlace: userData.livePlace,
    bornPlaceType: typeof userData.bornPlace,
    livePlaceType: typeof userData.livePlace,
  })

  // Helper function to get card style based on index
  const getCardStyle = (index: number) => {
    const isEven = index % 2 === 0
    return isEven
      ? 'bg-white rounded-2xl shadow-sm border border-[purple] p-4 mb-4'
      : 'bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm p-4 mb-4'
  }

  // Build array of card components
  const cards: React.ReactElement[] = []

  // Basic Info Section (always first, index 0)
  cards.push(
    <div key="basic-info" className={getCardStyle(0)}>
      <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
              </div>
              <button
                onClick={() => handleEditSection('personal')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-4">
              {/* Profile Picture - Above Name */}
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 border-4 border-purple-200 rounded-full overflow-hidden shadow-lg">
                    {userData.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt="profile picture"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <ImageUploader
                        image={profileImage}
                        setImage={setProfileImage}
                        className="w-full h-full object-cover cursor-pointer rounded-full"
                        isProfile={true}
                      />
                    )}
                  </div>
                  {/* Edit Button Overlay */}
                  <button
                    onClick={() => handleEditSection('profile')}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{userData.fullName}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                <p className="text-gray-600">{userData.username ? `@${userData.username}` : ''}</p>
                {userData.isVerified === true && <CheckCircle className="w-5 h-5 text-blue-500" />}
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                {age && (
                  <div className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Age {age}</span>
                  </div>
                )}
                {((userData.height != null && userData.height > 0) || (userData.weight != null && userData.weight > 0)) && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <Ruler className="w-4 h-4" />
                    <span>
                      {(userData.height != null && userData.height > 0) && (userData.weight != null && userData.weight > 0)
                        ? `${userData.height}cm, ${userData.weight}kg`
                        : (userData.height != null && userData.height > 0)
                        ? `${userData.height}cm`
                        : (userData.weight != null && userData.weight > 0) ? `${userData.weight}kg` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Location Info */}
              {((userData.bornPlace &&
                typeof userData.bornPlace === 'string' &&
                userData.bornPlace.trim() !== '') ||
                (userData.livePlace &&
                  typeof userData.livePlace === 'string' &&
                  userData.livePlace.trim() !== '')) && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Location</span>
                  </div>
                  <div className="text-center space-y-1">
                    {userData.bornPlace &&
                      typeof userData.bornPlace === 'string' &&
                      userData.bornPlace.trim() !== '' && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Born:</span> {userData.bornPlace}
                        </p>
                      )}
                    {userData.livePlace &&
                      typeof userData.livePlace === 'string' &&
                      userData.livePlace.trim() !== '' && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Live:</span> {userData.livePlace}
                        </p>
                      )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6 text-sm text-gray-600">
              {typeof userData.gender === 'string' && userData.gender.trim() !== '' && (
                <span className="flex items-center gap-1">
                  {userData.gender.toLowerCase() === 'male' ||
                  userData.gender.toLowerCase() === 'مرد' ? (
                    <Mars className="w-4 h-4" />
                  ) : userData.gender.toLowerCase() === 'female' ||
                    userData.gender.toLowerCase() === 'زن' ? (
                    <Venus className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  {userData.gender}
                </span>
              )}
              {typeof userData.maritalStatus === 'string' &&
                userData.maritalStatus.trim() !== '' && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {userData.maritalStatus}
                  </span>
                )}
            </div>
          </div>
  )

  // Details Section
  if (typeof userData.details === 'string' && userData.details.trim() !== '') {
    cards.push(
      <div key="details" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">About Me</h3>
                </div>
                <button
                  onClick={() => handleEditSection('details')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-700">{userData.details}</p>
            </div>
    )
  }

  // Birth Date Section
  if (userData.birthDate) {
    cards.push(
      <div key="birth-date" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Birth Date</h3>
                </div>
                <button
                  onClick={() => handleEditSection('personal')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-700">{dayjs(userData.birthDate).format('MMMM DD, YYYY')}</p>
            </div>
    )
  }

  // Education Section
  if (
    (userData.education?.university != null && userData.education.university !== '') ||
    (userData.education?.topic != null && userData.education.topic !== '') ||
    (userData.education?.graduationYear != null && userData.education.graduationYear !== '') ||
    (userData.educationalStatus && userData.educationalStatus !== 'none')
  ) {
    cards.push(
      <div key="education" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Education</h3>
                </div>
                <button
                  onClick={() => handleEditSection('education')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {userData.educationalStatus && userData.educationalStatus !== 'none' && (
                  <div className="text-gray-700">
                    <span className="font-medium">Status: </span>
                    <span className="capitalize">{userData.educationalStatus}</span>
                  </div>
                )}
                {userData.education?.university != null && userData.education.university !== '' && (
                  <div className="text-gray-700">
                    <span className="font-medium">University: </span>
                    {userData.education.university}
                  </div>
                )}
                {userData.education?.topic != null && userData.education.topic !== '' && (
                  <div className="text-gray-700">
                    <span className="font-medium">Topic: </span>
                    {userData.education.topic}
                  </div>
                )}
                {userData.education?.graduationYear != null && userData.education.graduationYear !== '' && (
                  <div className="text-gray-700">
                    <span className="font-medium">Graduation Year: </span>
                    {userData.education.graduationYear}
                  </div>
                )}
              </div>
            </div>
    )
  }

  // Job Section
  if (userData.job?.position || userData.job?.company) {
    cards.push(
      <div key="job" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Job</h3>
                </div>
                <button
                  onClick={() => handleEditSection('job')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-1">
                {userData.job.position && <div>Position: {userData.job.position}</div>}
                {userData.job.company && <div>Company: {userData.job.company}</div>}
              </div>
            </div>
    )
  }

  // Travel Section
  if (
    (userData.travelStyle && userData.travelStyle.length > 0) ||
    (userData.visitedCountries && userData.visitedCountries.length > 0)
  ) {
    cards.push(
      <div key="travel" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Travel</h3>
                </div>
                <button
                  onClick={() => handleEditSection('travel')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3">
                {userData.travelStyle && userData.travelStyle.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Travel Styles:</div>
                    <div className="flex flex-wrap gap-2">
                      {userData.travelStyle.map((style, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-[purple]"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {userData.visitedCountries && userData.visitedCountries.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Visited Countries:</div>
                    <div className="flex flex-wrap gap-2">
                      {userData.visitedCountries.map((country, index) => {
                        // Find the country data to get the flag
                        const countryData = countriesData?.find(
                          (c) => c.name.toLowerCase() === country.toLowerCase()
                        )

                        return (
                          <span
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-[purple]"
                          >
                            {countryData?.image ? (
                              <Image
                                src={countryData.image}
                                alt={country}
                                width={16}
                                height={12}
                                className="object-contain rounded-sm"
                              />
                            ) : (
                              <span className="text-xs">{countryData?.emoji || '🏳️'}</span>
                            )}
                            {country}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
    )
  }

  // Interests Section
  if (displayInterests && displayInterests.length > 0) {
    cards.push(
      <div key="interests" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Interests</h3>
                </div>
                <button
                  onClick={() => handleEditSection('interests')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 pb-3">
                {displayInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-[purple] whitespace-nowrap"
                  >
                    {getInterestEmoji(interest)} {stripEmoji(interest)}
                  </span>
                ))}
              </div>
            </div>
    )
  }

  // Skills Section
  if (displaySkills && displaySkills.length > 0) {
    cards.push(
      <div key="skills" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Skills</h3>
                </div>
                <button
                  onClick={() => handleEditSection('skills')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 pb-3">
                {displaySkills.map((skill, index) => (
                  <div key={index} className="text-gray-700 text-sm flex items-center">
                    <span className="mr-1">{skillEmojiMap[skill] || '✨'}</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
    )
  }

  // Sports Section
  if (
    (userData.favoriteSport && userData.favoriteSport.length > 0) ||
    userData.doesExercise !== undefined
  ) {
    cards.push(
      <div key="sports" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Sports & Exercise</h3>
                </div>
                <button
                  onClick={() => handleEditSection('sports')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3">
                {userData.favoriteSport && userData.favoriteSport.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Favorite Sports:</div>
                    <div className="flex flex-wrap gap-2">
                      {userData.favoriteSport.map((sport, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-[purple]"
                        >
                          {getSportEmoji(sport)} {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {userData.doesExercise !== undefined && (
                  <p className="text-gray-700">Exercise: {userData.doesExercise ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
    )
  }

  // Pet Information Section
  if (userData.pet.name || userData.pet.breed) {
    cards.push(
      <div key="pet" className={getCardStyle(cards.length)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Pet Information</h3>
                </div>
                <button
                  onClick={() => handleEditSection('pet')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div>
                {userData.pet.name && (
                  <h4 className="font-bold text-gray-900">{userData.pet.name}</h4>
                )}
                {userData.pet.breed && (
                  <p className="text-gray-600 text-sm">{userData.pet.breed}</p>
                )}
              </div>
            </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 px-4 pt-8 pb-4 overflow-y-auto overflow-x-hidden">
        <div id="bio-content">
          {cards}
        </div>
        {/* End of Screenshot Content */}

        {/* Share with Friend Button  */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm p-6 mb-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Share Your Bio</h3>
            <p className="text-gray-600 text-sm mb-4">
              Share your bio with friends and let them know more about you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  trackShareAction('link')
                  setShowShareModal(true)
                }}
                className="inline-flex basis-1/2 items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                <span className="whitespace-nowrap">Share Link</span>
              </button>
              <button
                onClick={handleScreenshot}
                className="inline-flex basis-1/2 items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Camera className="w-5 h-5" />
                <span className="whitespace-nowrap">Take Screenshot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Version Button */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-sm border border-yellow-200 p-6 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">Premium Version</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
            Unlock advanced insights and link your Instagram account!
            </p>
            <Dialog open={isWaitlistDialogOpen} onOpenChange={handleWaitlistDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Crown className="w-5 h-5" />
                  Join waitlist now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {isWaitlistSuccess ? (
                  <div className="space-y-6">
                    <DialogHeader>
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                      </div>
                      <DialogTitle className="text-center text-xl">
                        Successfully Joined!
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Thank you for joining our waitlist. We&apos;ll contact you within 24 hours with premium access details.
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      onClick={handleWaitlistDialogClose}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-600" />
                        Premium Version
                      </DialogTitle>
                      <DialogDescription>
                        Unlock advanced features and customization options!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Contact Form */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setWaitlistError('')
                            }}
                            placeholder="Enter your email"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value)
                              setWaitlistError('')
                            }}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {waitlistError && (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            {waitlistError}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handlePremiumSubmit}
                        disabled={isSubmittingWaitlist}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmittingWaitlist ? 'Submitting...' : 'Get Premium Access'}
                      </Button>

                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Social Media - Commented out for now */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Social Media</h3>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Facebook className="w-6 h-6 text-white" />
            </div>
          </div>
        </div> */}
      </div>

      {/* Share Modal */}
      {showShareModal && userData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          userData={userData}
        />
      )}

      {/* Share Screenshot Modal */}
      {showShareScreenshot && userData && (
        <ShareScreenshot userData={userData} onClose={() => setShowShareScreenshot(false)} />
      )}
    </div>
  )
}

export default function Bio() {
  return <ClientOnlyBioContent />
}
