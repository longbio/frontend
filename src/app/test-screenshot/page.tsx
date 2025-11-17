'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { GetUserByIdResponse } from '@/service/user/type'

const ShareScreenshot = dynamic(() => import('@/app/bio/components/ShareScreenshot'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-white/70 px-6 py-4 text-sm font-medium text-purple-700 shadow-lg">
      Preparing screenshot builder…
    </div>
  ),
})

const skillMapping: Record<string, string> = {
  '1': 'Sports',
  '2': 'Painting',
  '3': 'Music',
  '4': 'Singing',
  '5': 'Cultural Travel',
  '6': 'Dancing',
  '7': 'Physics & Math',
  '8': 'Cooking',
  '9': 'Photography',
  '10': 'Road Trip',
  '11': 'Eco-Tourism',
}

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
  favoriteSport: ['Paddle Tennis', 'Running', 'Football'],
  travelStyle: ['Luxury Travel', 'Cultural Travel', 'Road Trip'],
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
  },
  pet: {
    name: 'Milo',
    breed: 'Golden Retriever',
  },
  skills: ['1', '3', '8'], // Sports, Music, Cooking
  interests: ['Photography', 'Traveling', 'Reading', 'Coffee tasting'],
  visitedCountries: ['Iran', 'United Arab Emirates', 'Turkey', 'France', 'Italy'],
}

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const resolvedSkills = mockUserData.skills?.map((skill) => skillMapping[skill] ?? skill) ?? []
  const quickFacts = [
    { label: 'Gender', value: mockUserData.gender },
    { label: 'Marital Status', value: mockUserData.maritalStatus },
    { label: 'Height', value: `${mockUserData.height} cm` },
    { label: 'Weight', value: `${mockUserData.weight} kg` },
    { label: 'Born Place', value: mockUserData.bornPlace },
    { label: 'Live Place', value: mockUserData.livePlace },
    { label: 'Education Status', value: mockUserData.educationalStatus },
    { label: 'Does Exercise', value: mockUserData.doesExercise ? 'Yes' : 'No' },
  ].filter((fact) => fact.value)
  const listGroups = [
    { label: 'Skills', values: resolvedSkills },
    { label: 'Interests', values: mockUserData.interests ?? [] },
    { label: 'Travel Styles', values: mockUserData.travelStyle ?? [] },
    { label: 'Visited Countries', values: mockUserData.visitedCountries ?? [] },
    { label: 'Favorite Sports', values: mockUserData.favoriteSport ?? [] },
  ]
  const petFacts = [
    { label: 'Pet Name', value: mockUserData.pet?.name },
    { label: 'Pet Breed', value: mockUserData.pet?.breed },
  ].filter((fact) => fact.value)

  const handleDownloadPreview = () => {
    if (!preview || typeof document === 'undefined') return
    const link = document.createElement('a')
    link.href = preview
    link.download = `${mockUserData.username}-bio-snapshot.png`
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
        <header className="space-y-2 text-center">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-purple-700">
            LongBio Internal
          </span>
          <h1 className="text-3xl font-bold text-gray-900">Screenshot Playground</h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-600">
            این صفحهٔ تست به شما کمک می‌کند تا خروجی کامپوننت <code>ShareScreenshot</code> را با
            داده‌های فیک بررسی کنید. روی دکمهٔ زیر کلیک کنید، اسکرین‌شات گرفته می‌شود و نتیجه به
            صورت تمام‌صفحه نمایش داده خواهد شد.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-inner md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Hero Data</h2>
            <dl className="grid gap-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt>Full Name</dt>
                <dd className="font-medium text-purple-700">{mockUserData.fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Username</dt>
                <dd className="font-medium">@{mockUserData.username}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Birth Date</dt>
                <dd>{mockUserData.birthDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Location</dt>
                <dd>{mockUserData.livePlace}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Job</dt>
                <dd>{mockUserData.job.position}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Lists &amp; Tags</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-purple-700">Travel Styles:</span>{' '}
                {mockUserData.travelStyle.join(' • ')}
              </div>
              <div>
                <span className="font-medium text-purple-700">Visited Countries:</span>{' '}
                {mockUserData.visitedCountries?.join(' • ')}
              </div>
              <div>
                <span className="font-medium text-purple-700">Favorite Sports:</span>{' '}
                {mockUserData.favoriteSport.join(' • ')}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl border border-pink-100 bg-white/90 p-6 shadow-inner lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Full Bio Facts</h2>
            <dl className="space-y-2 text-sm text-gray-700">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex justify-between rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2"
                >
                  <dt className="font-medium text-gray-600">{fact.label}</dt>
                  <dd className="text-gray-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {mockUserData.details && (
              <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4 text-sm text-gray-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                  Details Payload (not rendered inside screenshot)
                </p>
                <p className="mt-2 leading-5 text-gray-800">{mockUserData.details}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {listGroups.map(
              (group) =>
                group.values.length > 0 && (
                  <div key={group.label}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                      {group.label}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.values.map((item) => (
                        <span
                          key={`${group.label}-${item}`}
                          className="rounded-full border border-purple-100 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}

            {petFacts.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Pet</p>
                <dl className="mt-2 space-y-1 text-sm text-gray-700">
                  {petFacts.map((fact) => (
                    <div key={fact.label} className="flex justify-between">
                      <dt>{fact.label}</dt>
                      <dd className="font-medium text-gray-900">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Generate the screenshot</h2>
          <p className="max-w-xl text-sm text-gray-600">
            با فشار دادن دکمهٔ زیر، مودال اصلی باز می‌شود. پس از اتمام عملیات، تصویر به صورت
            تمام‌صفحه نمایش داده شده و می‌توانید آن را دانلود یا ببندید.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
          >
            Open Share Screenshot
          </button>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6">
          <div className="relative flex h-full w-full max-w-[420px] flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Screenshot preview"
              className="h-full w-full rounded-2xl border border-white/20 object-contain shadow-2xl"
            />
            <div className="flex w-full flex-col gap-2 rounded-xl bg-white/90 p-4 shadow-lg md:flex-row">
              <button
                onClick={handleDownloadPreview}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Download PNG
              </button>
              <button
                onClick={() => setPreview(null)}
                className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ShareScreenshot
          userData={mockUserData}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            console.info('Screenshot captured successfully.')
          }}
          onScreenshotReady={(screenshot) => {
            setPreview(screenshot)
            setIsModalOpen(false)
          }}
          onError={(error: string) => {
            console.error('Screenshot error:', error)
          }}
        />
      )}
    </main>
  )
}
