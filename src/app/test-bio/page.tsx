'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import type { GetUserByIdResponse } from '@/service/user/type'
import BioDisplay from '../bio/components/BioDisplay'
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


const mockUserData: GetUserByIdResponse['data'] = {
  id: 42,
  username: 'mehdi',
  birthDate: '1998-04-29',
  fullName: 'Mehdi Mousakhani',
  gender: 'Male',
  maritalStatus: 'Single',
  educationalStatus: 'Graduated',
  profileImage: '/assets/images/cover-image.png',
  isVerified: true,
  height: 181,
  weight: 76,
  bornPlace: 'Tehran',
  livePlace: 'Dubai, UAE',
  doesExercise: true,
  favoriteSport: [
    'Paddle Tennis',
    'Running',
    'Football',
    'Basketball',
    'Swimming',
    'Cycling',
    'Tennis',
    'Volleyball',
    'Golf',
    'Yoga',
  ],
  travelStyle: [
    'Luxury Travel',
    'Cultural Travel',
    'Road Trip',
    'Adventure Travel',
    'Beach Vacation',
    'City Break',
    'Mountain Hiking',
    'Solo Travel',
    'Group Travel',
    'Business Travel',
  ],
  details:
    'Product designer who loves technology, travel and taking candid photos. Building delightful experiences every single day.',
  education: {
    topic: 'Business & Management',
    university: 'Sharif University of Technology',
    graduationYear: '2020',
  },
  job: {
    company: 'LongBio Studio',
    position: 'Lead Product Designer',
    tags: ['Freelance', 'Remote', 'Part-time', 'Full-time', 'Contract', 'Internship'],
  },
  pet: {
    name: 'Milo',
    breed: 'Golden Retriever',
  },
  skills: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  interests: [
    'Photography',
    'Traveling',
    'Reading',
    'Coffee tasting',
    'Cooking',
    'Music',
    'Art',
    'Technology',
    'Gaming',
    'Fitness',
  ],
  visitedCountries: [
    'Iran',
    'United Arab Emirates',
    'Turkey',
    'France',
    'Italy',
    'Spain',
    'Germany',
    'United Kingdom',
    'Netherlands',
    'Belgium',
    'Switzerland',
    'Austria',
  ],
}

const TestBioContent = dynamic(() => Promise.resolve(BioContent), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function BioContent() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    if (mockUserData?.profileImage) {
      setProfileImage(mockUserData.profileImage)
    }
  }, [])

  return (
    <BioDisplay
      userData={mockUserData}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
      username={mockUserData.username}
    />
  )
}

export default function TestBioPage() {
  return <TestBioContent />
}

