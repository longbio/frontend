'use client'
// import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState, useEffect } from 'react'
import ImageUploader from './components/ImageUploader'
// import petPic from '/assets/images/pet.png'
import {
  MapPin,
  Calendar,
  Ruler,
  Edit3,
  User,
  Heart,
  GraduationCap,
  Dumbbell,
  Star,
  PawPrint,
  BookOpen,
} from 'lucide-react'
import { getUserDataFromCookies, calculateAge, type UserData } from '@/utils/userData'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import { useGetUserById } from '@/service/user/hook'

function BioContent() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const { mutateAsync: getUserById } = useGetUserById()

  const userId = params.id as string

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // First try to get data from API
        if (userId && userId !== 'undefined') {
          try {
            const apiData = await getUserById(userId)
            if (apiData?.success && apiData.data) {
              setUserData(apiData.data)
              setLoading(false)
              return
            }
          } catch (error) {
            console.log('API fetch failed, falling back to cookies:', error)
          }
        }

        // Fallback to cookies
        if (typeof window !== 'undefined') {
          const data = getUserDataFromCookies()

          // Get name from URL parameter as fallback
          const nameFromUrl = searchParams.get('name')
          if (nameFromUrl && (!data.name || data.name === 'Fari Zadeh')) {
            data.name = nameFromUrl
          }

          setUserData(data)

          // Set profile image if available
          if (data.profileImage) {
            setProfileImage(data.profileImage)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, searchParams, getUserById])

  const handleEditSection = (section: string) => {
    // Navigate to the appropriate step based on section
    const stepMap: { [key: string]: string } = {
      personal: '/info/birthday',
      gender: '/info/gender',
      marital: '/info/marital',
      physical: '/info/physical',
      country: '/info/born',
      education: '/info/education',
      job: '/info/job',
      interests: '/info/interest',
      skills: '/info/skill',
      sports: '/info/sport',
      pet: '/info/pet',
      profile: '/info/set-profile',
    }

    const stepUrl = stepMap[section]
    if (stepUrl) {
      router.push(stepUrl)
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
    return <div>Error loading profile data</div>
  }

  const age = calculateAge(userData.birthday)
  const birthdayFormatted = `${userData.birthday.year} / ${userData.birthday.month.padStart(
    2,
    '0'
  )} / ${userData.birthday.day.padStart(2, '0')}`

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

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h3>
            <p className="text-gray-600 mb-4">
              {userData.education === 'student'
                ? 'Student'
                : userData.education === 'graduated'
                ? 'Graduated'
                : 'Professional'}
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {userData.country.birthCity}, {userData.country.birthCountry}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                <Calendar className="w-4 h-4" />
                <span>Age {age}</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <Ruler className="w-4 h-4" />
                <span>
                  {userData.physical.height}, {userData.physical.weight}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {userData.gender}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {userData.marital}
            </span>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Birth Date */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
            <p className="text-gray-700">{birthdayFormatted}</p>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
            <p className="text-gray-700">{userData.education}</p>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
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
          <div className="flex flex-wrap gap-2">
            {userData.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm border border-purple-200"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Skills and Sports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
            <div className="space-y-2">
              {userData.skills.map((skill, index) => (
                <div key={index} className="text-gray-700 text-sm">
                  • {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Sports & Activities</h3>
              </div>
              <button
                onClick={() => handleEditSection('sports')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {userData.sports.map((sport, index) => (
                <div key={index} className="text-gray-700 text-sm">
                  • {sport}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pet Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
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

          {userData.pet.hasPet ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                {userData.pet.petImage ? (
                  <Image
                    src={userData.pet.petImage}
                    alt="pet picture"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/assets/images/pet.png"
                    alt="pet picture"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{userData.pet.petName}</h4>
                <p className="text-gray-600 text-sm">{userData.pet.petBreed}</p>
                <p className="text-gray-500 text-xs">Age 3</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No pets</p>
          )}
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
    </div>
  )
}

export default function Bio() {
  return (
    <Suspense>
      <BioContent />
    </Suspense>
  )
}
