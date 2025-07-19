'use client'
import { z } from 'zod'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import AddButton from '../components/AddButton'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

const defaultInterests = [
  'Travelling',
  'Cooking',
  '📚 Books',
  '☕ Coffee',
  'Movies and series',
  'Music',
  'Volunteering',
  'friends',
  'Social media',
  '🌸 Flowers & Gardening',
  'Sports and gym',
  '🧘‍♂️ Meditation',
]

const interestSchema = z.object({
  interests: z.array(z.string()).min(1, 'please choose one'),
})
type InterestFormType = z.infer<typeof interestSchema>

function InterestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const [customInterests, setCustomInterests] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const {
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<InterestFormType>({
    resolver: zodResolver(interestSchema),
    mode: 'onChange',
    defaultValues: { interests: [] },
  })

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

  const onSubmit = () => {
    router.push(`/info/more-detail?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={85.74} className="shrink-0" />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> Long-Bio, {name}!
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
                  {interest}
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
          onSkip={() => router.push(`/info/more-detail?name=${name}`)}
          className="mt-8"
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
