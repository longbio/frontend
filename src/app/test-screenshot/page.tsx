'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import dynamicImport from 'next/dynamic'

const ShareScreenshot = dynamicImport(() => import('../bio/components/ShareScreenshot'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})
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

// Mock user data for testing
const mockUserData: GetUserByIdResponse['data'] = {
  id: 1,
  username: 'testuser',
  birthDate: '1995-06-15',
  fullName: 'علی احمدی',
  gender: 'male',
  maritalStatus: 'single',
  educationalStatus: 'graduated',
  profileImage: '/assets/images/cover-image.png',
  isVerified: true,
  height: 180,
  weight: 75,
  bornPlace: 'تهران',
  livePlace: 'تهران',
  doesExercise: true,
  favoriteSport: ['فوتبال', 'بسکتبال'],
  travelStyle: ['ماجراجویی', 'فرهنگی'],
  details: 'علاقه‌مند به تکنولوژی و ورزش. دوست دارم با مردم جدید آشنا شوم و تجربیات جدید کسب کنم.',
  education: {
    topic: 'مهندسی کامپیوتر',
    university: 'دانشگاه تهران',
    graduationYear: '2018',
  },
  job: {
    company: 'شرکت فناوری پارس',
    position: 'توسعه‌دهنده نرم‌افزار',
  },
  pet: {
    name: 'بابی',
    breed: 'گلدن رتریور',
  },
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  interests: ['برنامه‌نویسی', 'ورزش', 'سفر', 'موسیقی'],
  visitedCountries: ['ترکیه', 'دبی', 'مالزی'],
}

export default function TestScreenshotPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const age = mockUserData.birthDate
    ? new Date().getFullYear() - new Date(mockUserData.birthDate).getFullYear()
    : null

  return (
    <div className="bg-gray-50 p-8">
      <div className="">
        {/* Bio content that will be captured in screenshot - EXACTLY like the real bio page */}
        <div
          id="bio-content"
          className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
        >
          {/* Main Content */}
          <div className="px-4 overflow-y-auto">
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
                      {mockUserData.profileImage ? (
                        <Image
                          src={mockUserData.profileImage}
                          alt="profile picture"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '50%' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {mockUserData.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mockUserData.fullName}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <p className="text-gray-600">
                    {mockUserData.username ? `@${mockUserData.username}` : ''}
                  </p>
                  {mockUserData.isVerified === true && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                <div className="flex justify-center gap-3 flex-wrap">
                  {age && (
                    <div className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Age {age}</span>
                    </div>
                  )}
                  {(mockUserData.height > 0 || mockUserData.weight > 0) && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <Ruler className="w-4 h-4" />
                      <span>
                        {mockUserData.height > 0 && mockUserData.weight > 0
                          ? `${mockUserData.height}cm, ${mockUserData.weight}kg`
                          : mockUserData.height > 0
                          ? `${mockUserData.height}cm`
                          : `${mockUserData.weight}kg`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Location Info */}
                {((mockUserData.bornPlace &&
                  typeof mockUserData.bornPlace === 'string' &&
                  mockUserData.bornPlace.trim() !== '') ||
                  (mockUserData.livePlace &&
                    typeof mockUserData.livePlace === 'string' &&
                    mockUserData.livePlace.trim() !== '')) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <div className="text-center space-y-1">
                      {mockUserData.bornPlace &&
                        typeof mockUserData.bornPlace === 'string' &&
                        mockUserData.bornPlace.trim() !== '' && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Born:</span> {mockUserData.bornPlace}
                          </p>
                        )}
                      {mockUserData.livePlace &&
                        typeof mockUserData.livePlace === 'string' &&
                        mockUserData.livePlace.trim() !== '' && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Live:</span> {mockUserData.livePlace}
                          </p>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-6 text-sm text-gray-600">
                {typeof mockUserData.gender === 'string' && mockUserData.gender.trim() !== '' && (
                  <span className="flex items-center gap-1">
                    {mockUserData.gender.toLowerCase() === 'male' ||
                    mockUserData.gender.toLowerCase() === 'مرد' ? (
                      <Mars className="w-4 h-4" />
                    ) : mockUserData.gender.toLowerCase() === 'female' ||
                      mockUserData.gender.toLowerCase() === 'زن' ? (
                      <Venus className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                    {mockUserData.gender}
                  </span>
                )}
                {typeof mockUserData.maritalStatus === 'string' &&
                  mockUserData.maritalStatus.trim() !== '' && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {mockUserData.maritalStatus}
                    </span>
                  )}
              </div>
            </div>

            {/* Details  */}
            {typeof mockUserData.details === 'string' && mockUserData.details.trim() !== '' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">About Me</h3>
                </div>
                <p className="text-gray-700">{mockUserData.details}</p>
              </div>
            )}

            {/* Birth Date  */}
            {mockUserData.birthDate && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Birth Date</h3>
                </div>
                <p className="text-gray-700">
                  {dayjs(mockUserData.birthDate).format('MMMM DD, YYYY')}
                </p>
              </div>
            )}

            {/* Education  */}
            {(mockUserData.education?.university ||
              mockUserData.education?.topic ||
              mockUserData.education?.graduationYear ||
              (mockUserData.educationalStatus && mockUserData.educationalStatus !== 'none')) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Education</h3>
                </div>
                <div className="space-y-2">
                  {mockUserData.educationalStatus && mockUserData.educationalStatus !== 'none' && (
                    <div className="text-gray-700">
                      <span className="font-medium">Status: </span>
                      <span className="capitalize">{mockUserData.educationalStatus}</span>
                    </div>
                  )}
                  {mockUserData.education?.university && (
                    <div className="text-gray-700">
                      <span className="font-medium">University: </span>
                      {mockUserData.education.university}
                    </div>
                  )}
                  {mockUserData.education?.topic && (
                    <div className="text-gray-700">
                      <span className="font-medium">Topic: </span>
                      {mockUserData.education.topic}
                    </div>
                  )}
                  {mockUserData.education?.graduationYear && (
                    <div className="text-gray-700">
                      <span className="font-medium">Graduation Year: </span>
                      {mockUserData.education.graduationYear}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job  */}
            {(mockUserData.job?.position || mockUserData.job?.company) && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Job</h3>
                </div>
                <div className="space-y-1">
                  {mockUserData.job.position && <div>Position: {mockUserData.job.position}</div>}
                  {mockUserData.job.company && <div>Company: {mockUserData.job.company}</div>}
                </div>
              </div>
            )}

            {/* Travel  */}
            {(mockUserData.travelStyle && mockUserData.travelStyle.length > 0) ||
            (mockUserData.visitedCountries && mockUserData.visitedCountries.length > 0) ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Travel</h3>
                </div>
                <div className="space-y-3">
                  {mockUserData.travelStyle && mockUserData.travelStyle.length > 0 && (
                    <div>
                      <div className="font-medium text-gray-700 mb-2">Travel Styles:</div>
                      <div className="flex flex-wrap gap-2">
                        {mockUserData.travelStyle.map((style, index) => (
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
                  {mockUserData.visitedCountries && mockUserData.visitedCountries.length > 0 && (
                    <div>
                      <div className="font-medium text-gray-700 mb-2">Visited Countries:</div>
                      <div className="flex flex-wrap gap-2">
                        {mockUserData.visitedCountries.map((country, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Interests  */}
            {mockUserData.interests && mockUserData.interests.length > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Interests</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto interests-scroll pt-2 pb-3">
                  {mockUserData.interests.map((interest, index) => (
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

            {/* Skills */}
            {mockUserData.skills && mockUserData.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Skills</h3>
                </div>
                <div className="space-y-2">
                  {mockUserData.skills.map((skill, index) => (
                    <div key={index} className="text-gray-700 text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sports  */}
            {(mockUserData.favoriteSport && mockUserData.favoriteSport.length > 0) ||
            mockUserData.doesExercise !== undefined ? (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Sports & Exercise</h3>
                </div>
                <div className="space-y-3">
                  {mockUserData.favoriteSport && mockUserData.favoriteSport.length > 0 && (
                    <div>
                      <div className="font-medium text-gray-700 mb-2">Favorite Sports:</div>
                      <div className="flex flex-wrap gap-2">
                        {mockUserData.favoriteSport.map((sport, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {mockUserData.doesExercise !== undefined && (
                    <p className="text-gray-700">
                      Exercise: {mockUserData.doesExercise ? 'Yes' : 'No'}
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Pet Information  */}
            {(mockUserData.pet.name || mockUserData.pet.breed) && (
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
                    {mockUserData.pet.name && (
                      <h4 className="font-bold text-gray-900">{mockUserData.pet.name}</h4>
                    )}
                    {mockUserData.pet.breed && (
                      <p className="text-gray-600 text-sm">{mockUserData.pet.breed}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Create Your Bio Button - Hidden from screenshot */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-sm border border-purple-200 p-6 mb-4 ignore-screenshot">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Create Your Long Bio</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join LongBio and create your personalized bio page to share with friends!
                </p>
                <a
                  href="https://longbio.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ExternalLink className="size-5" />
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            تست اسکرین‌شات
          </button>
        </div>

        {isModalOpen && (
          <ShareScreenshot
            userData={mockUserData}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              console.log('Screenshot generated successfully!')
            }}
            onError={(error: string) => {
              console.error('Screenshot error:', error)
            }}
          />
        )}
      </div>
    </div>
  )
}
