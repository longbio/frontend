'use client'
import { z } from 'zod'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import AddButton from '../components/AddButton'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
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
  skills: z.array(z.string()).min(1, 'حداقل یک مهارت باید انتخاب شود'),
})
type SkillFormType = z.infer<typeof skillSchema>

function SkillContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const [customSkills, setCustomSkills] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const {
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<SkillFormType>({
    resolver: zodResolver(skillSchema),
    mode: 'onChange',
    defaultValues: { skills: [] },
  })

  // Sync selected with form
  const handleSelect = (skill: string) => {
    let updated: string[]
    if (selected.includes(skill)) {
      updated = selected.filter((s) => s !== skill)
      if (customSkills.includes(skill)) {
        setCustomSkills(customSkills.filter((s) => s !== skill))
      }
    } else {
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
      <Progress value={82.5} />
      <Header className="mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow justify-start items-center mt-2 space-y-4"
      >
        <h1 className="text-2xl font-bold text-left w-full">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal text-left w-full">
          Let&apos;s talk about your skills.
        </span>
        <span className="text-xl font-bold mt-8 w-full">Choose the skills you are good at:</span>
        <div className="flex flex-wrap gap-2 justify-stretch w-full">
          {[...defaultSkills, ...customSkills].map((skill) => (
            <Toggle
              key={skill}
              pressed={selected.includes(skill)}
              onPressedChange={() => handleSelect(skill)}
              className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border border-black hover:text-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full"
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
        <Button
          type="submit"
          className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
        >
          Next
        </Button>
      </form>
      <button
        type="button"
        className="w-full text-sm font-normal mt-2 rounded-4xl"
        onClick={() => router.push(`/info/interest?name=${name}`)}
      >
        skip
      </button>
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
