'use client'
// import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ImageUploader from '../components/ImageUploader'
// import petPic from '/assets/images/pet.png'
import {
  MapPin,
  Calendar,
  Ruler,
  User,
  Heart,
  GraduationCap,
  Dumbbell,
  Star,
  PawPrint,
  BookOpen,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import type { GetUserByIdResponse } from '@/service/user/type'
// import { useGetCurrentUser } from '@/service/user/hook'

const ClientOnlyBioContent = dynamic(() => Promise.resolve(BioContent), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function BioContent({ userId }: { userId: string }) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userData, setUserData] = useState<GetUserByIdResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data by ID from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const userResponse = await fetch(`${apiUrl}/v1/users/${userId}`, { credentials: 'include' })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserData(userData.data)
          if (userData.data.profileImage) {
            setProfileImage(userData.data.profileImage)
          }
        } else {
          // If user not found, show error
          setUserData(null)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUserData(null)
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  // Set profile image when user data is loaded
  useEffect(() => {
    if (userData?.profileImage) {
      setProfileImage(userData.profileImage)
    }
  }, [userData])

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

  const interestMapping: { [key: string]: string } = {
    '1': 'Reading',
    '2': 'Movies',
    '3': 'Gaming',
    '4': 'Art',
    '5': 'Technology',
    '6': 'Fashion',
    '7': 'Food',
    '8': 'Nature',
    '9': 'Fitness',
    '10': 'Travel',
  }

  // Convert ID arrays to actual names
  const displaySkills = userData.skills?.map((skill) => skillMapping[skill] || skill) || []
  const displayInterests =
    userData.interests?.map((interest) => interestMapping[interest] || interest) || []

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 px-4 pt-8 pb-4 overflow-y-auto">
        {/* Basic Info Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
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
                      image={profileImage}
                      setImage={setProfileImage}
                      className="w-full h-full object-cover cursor-pointer rounded-full"
                      isProfile={true}
                    />
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{userData.fullName}</h3>
            <p className="text-gray-600 mb-2">
              {userData.educationalStatus === 'student'
                ? 'Student'
                : userData.educationalStatus === 'graduated'
                ? 'Graduated'
                : 'Professional'}
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              {(userData.bornPlace || userData.livePlace) && (
                <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {userData.bornPlace && userData.livePlace
                      ? `${userData.bornPlace}, ${userData.livePlace}`
                      : userData.bornPlace || userData.livePlace}
                  </span>
                </div>
              )}
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
          </div>

          <div className="flex justify-center gap-6 text-sm text-gray-600">
            {typeof userData.gender === 'string' && userData.gender.trim() !== '' && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
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

        {/* Birth Date  */}
        {userData.birthDate && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Birth Date</h3>
            </div>
            <p className="text-gray-700">{userData.birthDate}</p>
          </div>
        )}

        {/* Education  */}
        {(userData.education?.university ||
          userData.education?.topic ||
          userData.education?.graduationYear ||
          (userData.educationalStatus && userData.educationalStatus !== 'none')) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Education</h3>
            </div>
            {userData.education?.university ||
            userData.education?.topic ||
            userData.education?.graduationYear ? (
              <div className="space-y-1">
                {userData.education.university && (
                  <div>University: {userData.education.university}</div>
                )}
                {userData.education.topic && <div>Topic: {userData.education.topic}</div>}
                {userData.education.graduationYear && (
                  <div>Graduation Year: {userData.education.graduationYear}</div>
                )}
              </div>
            ) : (
              <p className="text-gray-700 capitalize">{userData.educationalStatus}</p>
            )}
          </div>
        )}

        {/* Job  */}
        {(userData.job?.position || userData.job?.company) && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Job</h3>
            </div>
            <div className="space-y-1">
              {userData.job.position && <div>Position: {userData.job.position}</div>}
              {userData.job.company && <div>Company: {userData.job.company}</div>}
            </div>
          </div>
        )}

        {/* Travel Style  */}
        {typeof userData.travelStyle === 'string' && userData.travelStyle.trim() !== '' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Travel Style</h3>
            </div>
            <p className="text-gray-700">{userData.travelStyle}</p>
          </div>
        )}

        {/* Physical Info and Location - Responsive Grid */}
        {(userData.height > 0 ||
          userData.weight > 0 ||
          userData.bornPlace ||
          userData.livePlace) && (
          <div
            className={`grid gap-4 mb-4 ${
              (userData.height > 0 || userData.weight > 0) &&
              (userData.bornPlace || userData.livePlace)
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {/* Physical Info  */}
            {(userData.height > 0 || userData.weight > 0) && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Physical Info</h3>
                </div>
                <div className="space-y-1">
                  {userData.height > 0 && (
                    <p className="text-gray-700">Height: {userData.height} cm</p>
                  )}
                  {userData.weight > 0 && (
                    <p className="text-gray-700">Weight: {userData.weight} kg</p>
                  )}
                  <p className="text-gray-700">Exercise: {userData.doesExercise ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            {/* Location Info  */}
            {(userData.bornPlace || userData.livePlace) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Location</h3>
                </div>
                <div className="space-y-1">
                  {userData.bornPlace && (
                    <p className="text-gray-700">Born: {userData.bornPlace}</p>
                  )}
                  {userData.livePlace && (
                    <p className="text-gray-700">Live: {userData.livePlace}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visited Countries  */}
        {userData.visitedCountries && userData.visitedCountries.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Visited Countries</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData.visitedCountries.map((country, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details  */}
        {typeof userData.details === 'string' && userData.details.trim() !== '' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">About Me</h3>
            </div>
            <p className="text-gray-700">{userData.details}</p>
          </div>
        )}

        {/* Interests  */}
        {displayInterests && displayInterests.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Interests</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto interests-scroll pt-2 pb-3">
              {displayInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200 whitespace-nowrap flex-shrink-0"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {((displaySkills && displaySkills.length > 0) ||
          (userData.favoriteSport && userData.favoriteSport !== 'None')) && (
          <div
            className={`grid gap-4 mb-4 ${
              displaySkills &&
              displaySkills.length > 0 &&
              userData.favoriteSport &&
              userData.favoriteSport !== 'None'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {/* Skills */}
            {displaySkills && displaySkills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Skills</h3>
                </div>
                <div className="space-y-2">
                  {displaySkills.map((skill, index) => (
                    <div key={index} className="text-gray-700 text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sports  */}
            {userData.favoriteSport && userData.favoriteSport !== 'None' && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Favorite Sport</h3>
                </div>
                <p className="text-gray-700">{userData.favoriteSport}</p>
              </div>
            )}
          </div>
        )}

        {/* Pet Information  */}
        {(userData.pet.name || userData.pet.breed) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Pet Information</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/assets/images/pet.png"
                  alt="pet picture"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
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
          </div>
        )}

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
    </div>
  )
}

export default function Bio() {
  const params = useParams<{ id: string }>()
  const id = params?.id || ''
  return <ClientOnlyBioContent userId={id} />
}
