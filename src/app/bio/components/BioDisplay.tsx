'use client'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useFlagCountries } from '@/service/countries'
import ImageUploader from './ImageUploader'
import type { GetUserByIdResponse } from '@/service/user/type'
import {
  MapPin,
  Calendar,
  Ruler,
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
  ExternalLink,
  CheckCircle,
} from 'lucide-react'

interface BioDisplayProps {
  userData: GetUserByIdResponse['data'] | null
  profileImage?: string | null
  setProfileImage?: (image: string | null) => void
  username?: string
  onGetStartedClick?: () => void
}

export default function BioDisplay({
  userData,
  profileImage: externalProfileImage,
  setProfileImage: externalSetProfileImage,
  username,
  onGetStartedClick,
}: BioDisplayProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { data: countriesData } = useFlagCountries()

  const internalSetProfileImage = externalSetProfileImage || setProfileImage
  const displayProfileImage = externalProfileImage ?? profileImage

  // Set profile image when user data is loaded
  useEffect(() => {
    if (userData?.profileImage) {
      internalSetProfileImage(userData.profileImage)
    }
  }, [userData, internalSetProfileImage])

  if (!userData) {
    return null
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

  const handleGetStartedClick = () => {
    if (onGetStartedClick) {
      onGetStartedClick()
    }
  }

  // Helper function to get card style based on index
  const getCardStyle = (index: number) => {
    const isEven = index % 2 === 0
    return isEven
      ? 'bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'
      : 'bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4'
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
                      image={displayProfileImage}
                      setImage={internalSetProfileImage}
                      className="w-full h-full object-cover cursor-pointer rounded-full"
                      isProfile={true}
                    />
                  )}
                </div>
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
              {(userData.height > 0 || userData.weight > 0) && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Ruler className="w-4 h-4" />
                  <span>
                    {userData.height > 0 && userData.weight > 0
                      ? `${userData.height}cm, ${userData.weight}kg`
                      : userData.height > 0
                      ? `${userData.height}cm`
                      : `${userData.weight}kg`}
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
            {typeof userData.maritalStatus === 'string' && userData.maritalStatus.trim() !== '' && (
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
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">About Me</h3>
            </div>
            <p className="text-gray-700">{userData.details}</p>
          </div>
    )
  }

  // Birth Date Section
  if (userData.birthDate) {
    cards.push(
      <div key="birth-date" className={getCardStyle(cards.length)}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Birth Date</h3>
            </div>
            <p className="text-gray-700">{dayjs(userData.birthDate).format('MMMM DD, YYYY')}</p>
          </div>
    )
  }

  // Education Section
  if (
    userData.education?.university ||
    userData.education?.topic ||
    userData.education?.graduationYear ||
    (userData.educationalStatus && userData.educationalStatus !== 'none')
  ) {
    cards.push(
      <div key="education" className={getCardStyle(cards.length)}>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Education</h3>
            </div>
            <div className="space-y-2">
              {userData.educationalStatus && userData.educationalStatus !== 'none' && (
                <div className="text-gray-700">
                  <span className="font-medium">Status: </span>
                  <span className="capitalize">{userData.educationalStatus}</span>
                </div>
              )}
              {userData.education?.university && (
                <div className="text-gray-700">
                  <span className="font-medium">University: </span>
                  {userData.education.university}
                </div>
              )}
              {userData.education?.topic && (
                <div className="text-gray-700">
                  <span className="font-medium">Topic: </span>
                  {userData.education.topic}
                </div>
              )}
              {userData.education?.graduationYear && (
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
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Job</h3>
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
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Travel</h3>
            </div>
            <div className="space-y-3">
              {userData.travelStyle && userData.travelStyle.length > 0 && (
                <div>
                  <div className="font-medium text-gray-700 mb-2">Travel Styles:</div>
                  <div className="flex flex-wrap gap-2">
                    {userData.travelStyle.map((style, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200"
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
                          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200"
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
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 pb-3">
              {displayInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200 whitespace-nowrap"
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
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Skills</h3>
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
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Sports & Exercise</h3>
            </div>
            <div className="space-y-3">
              {userData.favoriteSport && userData.favoriteSport.length > 0 && (
                <div>
                  <div className="font-medium text-gray-700 mb-2">Favorite Sports:</div>
                    <div className="flex flex-wrap gap-2">
                      {userData.favoriteSport.map((sport, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200"
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
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Pet Information</h3>
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
        {cards}

        {/* Create Your Bio Button */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-6 mb-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Create Your Long Bio</h3>
            <p className="text-gray-600 text-sm mb-4">
              Join LongBio and create your personalized bio page to share with friends!
            </p>
            <a
              href="https://longbio.me"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGetStartedClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ExternalLink className="size-5" />
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

