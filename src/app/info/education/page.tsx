'use client'
import { z } from 'zod'
import React from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { AddUniversityBox } from './components/AddMoreBox'
import { useRouter, useSearchParams } from 'next/navigation'
import GraduationYearBox from './components/GraduationYearBox'
import AddMoreBox from '@/app/info/education/components/AddMoreBox'
import SelectableOption from '@/app/info/components/SelectableOption'

const educationSchema = z.object({
  education: z.string({
    required_error: 'Please select your education status',
  }),
})
type EducationFormData = z.infer<typeof educationSchema>

function EducationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue, watch } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: (() => {
      if (typeof window !== 'undefined') {
        const cookie = getCookie('info_education')
        if (cookie) {
          try {
            return JSON.parse(decodeURIComponent(cookie))
          } catch {}
        }
      }
      return {}
    })(),
  })
  const selectedEducation = watch('education')
  React.useEffect(() => {
    if (selectedEducation)
      setCookie('info_education', JSON.stringify({ education: selectedEducation }))
  }, [selectedEducation])
  const [universities, setUniversities] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [graduationYear, setGraduationYear] = useState<string | null>(null)

  const onSubmit = () => {
    router.push(`/info/set-profile?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={28.56} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal">Pick your education status.</span>
          </div>
          <div className="space-y-5 mt-10">
            <h2 className="text-xl font-bold">What is your educational status?</h2>
            <div className="space-y-2.5">
              <SelectableOption
                id="student"
                label="Student"
                checked={selectedEducation === 'student'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('education', 'student')
                  }
                }}
              />
              {selectedEducation === 'student' && (
                <div className="ml-8 mt-2">
                  <AddUniversityBox
                    universities={universities}
                    setUniversities={setUniversities}
                    placeholder="Add university..."
                  />
                  <AddMoreBox
                    options={topics}
                    setOptions={setTopics}
                    placeholder="Add topic..."
                    buttonLabel="Add Topic"
                  />
                  <GraduationYearBox
                    graduationYear={graduationYear}
                    setGraduationYear={setGraduationYear}
                  />
                </div>
              )}
              <SelectableOption
                id="graduated"
                label="Graduated"
                checked={selectedEducation === 'graduated'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('education', 'graduated')
                  }
                }}
              />
              {selectedEducation === 'graduated' && (
                <div className="ml-8 mt-2">
                  <AddUniversityBox
                    universities={universities}
                    setUniversities={setUniversities}
                    placeholder="Add university..."
                  />
                  <AddMoreBox
                    options={topics}
                    setOptions={setTopics}
                    placeholder="Add topic..."
                    buttonLabel="Add Topic"
                  />
                  <GraduationYearBox
                    graduationYear={graduationYear}
                    setGraduationYear={setGraduationYear}
                  />
                </div>
              )}
              <SelectableOption
                id="not-interested"
                label="Not interested in education"
                checked={selectedEducation === 'not-interested'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('education', 'not-interested')
                  }
                }}
              />
              <div className="flex items-center gap-1 text-xs mt-4">
                <Info className="size-4" />
                <span>You can always update this later</span>
              </div>
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => router.push(`/info/set-profile?name=${name}`)}
          className="mt-8"
        />
      </form>
    </div>
  )
}
export default function Education() {
  return (
    <Suspense>
      <EducationContent />
    </Suspense>
  )
}
