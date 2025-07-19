'use client'
import { z } from 'zod'
import React from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import AddButton from '../components/AddButton'
import { Toggle } from '@/components/ui/toggle'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'

const defaultSkills = [
  'Sports',
  'Painting',
  'Music',
  'singing',
  'Cultural Travel',
  'Dancing',
  'Physics and math',
  'Cooking',
  'Photography',
  'Road Trip',
  'Eco-Tourism',
]

const skillSchema = z.object({
  skills: z.array(z.string()).min(1, 'please choose one skill'),
})
type SkillFormType = z.infer<typeof skillSchema>

function SkillContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const [customSkills, setCustomSkills] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const cookie = getCookie('info_skill')
      if (cookie) {
        try {
          return JSON.parse(decodeURIComponent(cookie)).selected || []
        } catch {}
      }
    }
    return []
  })
  React.useEffect(() => {
    setCookie('info_skill', JSON.stringify({ selected }))
  }, [selected])

  const {
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<SkillFormType>({
    resolver: zodResolver(skillSchema),
    mode: 'onChange',
    defaultValues: { skills: [] },
  })

  const handleSelect = (skill: string) => {
    let updated: string[]
    if (selected.includes(skill)) {
      updated = selected.filter((s) => s !== skill)
      if (customSkills.includes(skill)) {
        setCustomSkills(customSkills.filter((s) => s !== skill))
      }
    } else {
      if (selected.length >= 5) {
        return
      }
      updated = [...selected, skill]
    }
    setSelected(updated)
    setValue('skills', updated, { shouldValidate: true })
  }

  const onSubmit = () => {
    router.push(`/info/interest?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={78.6} className="shrink-0" />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s talk about your skills.
            </span>
          </div>
          <div className="flex flex-col gap-y-4 mt-10">
            <h2 className="text-xl font-bold mt-8 w-full">Choose the skills you are good at:</h2>
            <div className="flex flex-wrap gap-2 justify-start md:justify-stretch w-full">
              {[...defaultSkills, ...customSkills].map((skill) => (
                <Toggle
                  key={skill}
                  pressed={selected.includes(skill)}
                  onPressedChange={() => handleSelect(skill)}
                  disabled={selected.length >= 5 && !selected.includes(skill)}
                  className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border border-black hover:text-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {skill}
                </Toggle>
              ))}
              <AddButton
                options={customSkills}
                setOptions={setCustomSkills}
                placeholder="Add your own..."
              />
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => router.push(`/info/interest?name=${name}`)}
          className="mt-8"
        />
      </form>
    </div>
  )
}
export default function Skill() {
  return (
    <Suspense>
      <SkillContent />
    </Suspense>
  )
}
