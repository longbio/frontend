'use client'
import { z } from 'zod'
import Header from '@/components/Header'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import AddButton from '../components/AddButton'
import StickyNav from '../components/StickyNav'
import { useUpdateUser } from '@/service/user/hook'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'

const defaultInterests = [
  'Travelling',
  'Cooking',
  'Books',
  'Coffee',
  'Movies and series',
  'Music',
  'Volunteering',
  'friends',
  'Social media',
  'Flowers & Gardening',
  'Sports and gym',
  'Meditation',
  'Photography',
  'Art',
  'Technology',
  'Gaming',
  'Fitness',
  'Dancing',
  'Hiking',
  'Writing',
  'Fashion',
  'Pets',
]

const stripEmoji = (text: string): string => {
  // Remove emojis including sequences with zero-width joiners
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{24C2}-\u{1F251}]|[\u{1FA00}-\u{1FAFF}]|[\u{200D}]/gu, '').replace(/\s+/g, ' ').trim()
}

const getInterestEmoji = (interest: string): string => {
  const lowerInterest = stripEmoji(interest).toLowerCase()
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
    'writing': '✍️',
    'fashion': '👠',
    'pets': '🐕',
  }
  
  for (const [key, emoji] of Object.entries(interestEmojiMap)) {
    if (lowerInterest.includes(key)) {
      return emoji
    }
  }
  return '⭐'
}

const interestSchema = z.object({
  interests: z.array(z.string()).min(1, 'please choose one'),
})
type InterestFormType = z.infer<typeof interestSchema>

function InterestContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || ''
  const isEditMode = searchParams?.get('edit') === 'true'
  const [customInterests, setCustomInterests] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_interest')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.selected) {
          setSelected(data.selected)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    setCookie('info_interest', JSON.stringify({ selected }))
  }, [selected])

  const {
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<InterestFormType>({
    resolver: zodResolver(interestSchema),
    mode: 'onChange',
    defaultValues: { interests: [] },
  })

  // Sync form value with selected state (especially when cached options load)
  useEffect(() => {
    setValue('interests', selected, { shouldValidate: true })
  }, [selected, setValue])

  // Sync selected with form
  const handleSelect = (interest: string) => {
    let updated: string[]
    if (selected.includes(interest)) {
      updated = selected.filter((s) => s !== interest)
      if (customInterests.includes(interest)) {
        setCustomInterests(customInterests.filter((s) => s !== interest))
      }
    } else {
      if (selected.length >= 5) {
        return
      }
      updated = [...selected, interest]
    }
    setSelected(updated)
    setValue('interests', updated, { shouldValidate: true })
  }

  const onSubmit = async () => {
    try {
      await mutation.mutateAsync({
        interests: selected,
      })

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/more-detail?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to update interests info', err)
      // Don't navigate on error
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={85.74} className="shrink-0" />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s talk about your interests.
            </span>
          </div>
          <div className="flex flex-col gap-y-4 mt-10">
            <h2 className="text-xl font-bold mt-8 w-full">
              Choose the options you are interested in
            </h2>
            <div className="flex flex-wrap gap-2 justify-start md:justify-stretch w-full">
              {[...defaultInterests, ...customInterests].map((interest) => (
                <Toggle
                  key={interest}
                  pressed={selected.includes(interest)}
                  onPressedChange={() => handleSelect(interest)}
                  disabled={selected.length >= 5 && !selected.includes(interest)}
                  className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border border-black hover:text-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getInterestEmoji(interest)} {stripEmoji(interest)}
                </Toggle>
              ))}
              <AddButton
                options={customInterests}
                setOptions={setCustomInterests}
                placeholder="Add your own..."
              />
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/more-detail?name=${name}`)
            }
          }}
          className="mt-8"
          loading={mutation.isPending}
        />
      </form>
    </div>
  )
}
export default function Interest() {
  return (
    <Suspense>
      <InterestContent />
    </Suspense>
  )
}
