'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { useUpdateUser } from '@/service/user/hook'
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
    defaultValues: {},
  })
  const selectedEducation = watch('education')

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_education')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.education) {
          setValue('education', data.education)
        }
      } catch {}
    }
  }, [setValue])

  useEffect(() => {
    if (selectedEducation)
      setCookie('info_education', JSON.stringify({ education: selectedEducation }))
  }, [selectedEducation])
  const [universities, setUniversities] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [graduationYear, setGraduationYear] = useState<string | null>(null)
  const mutation = useUpdateUser()

  const onSubmit = async () => {
    if (!selectedEducation) return router.push(`/info/set-profile?name=${name}`)

    const educationalStatus =
      selectedEducation === 'not-interested'
        ? 'not interested'
        : selectedEducation === 'student'
        ? 'student'
        : 'graduated'

    try {
      // eslint-disable-next-line
      const updateData: any = {
        educationalStatus,
      }

      // Only add education details if user is student or graduated
      if (selectedEducation === 'student' || selectedEducation === 'graduated') {
        // eslint-disable-next-line
        const educationData: any = {}

        if (topics.length > 0) {
          educationData.topic = topics.join(', ')
        }

        if (universities.length > 0) {
          educationData.university = universities.join(', ')
        }

        if (graduationYear) {
          educationData.graduationYear = graduationYear
        }

        if (Object.keys(educationData).length > 0) {
          updateData.education = educationData
        }
      }

      await mutation.mutateAsync(updateData)
    } catch (err) {
      console.error('Failed to update education', err)
    }

    router.push(`/info/job?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={28.56} />
      <Header className="mt-4" showBackButton />
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
                <div className="flex flex-col xl:gap-y-1 ml-8 mt-2">
                  <AddMoreBox
                    options={topics}
                    setOptions={setTopics}
                    placeholder="Add topic..."
                    buttonLabel="Add Topic"
                  />
                  <AddUniversityBox
                    universities={universities}
                    setUniversities={setUniversities}
                    placeholder="Add university..."
                    disabled={topics.length === 0}
                    selectedTopics={topics}
                  />
                  <AddMoreBox
                    options={[]}
                    setOptions={(newOptions) => {
                      const newUniversities = newOptions.filter(
                        (option) => !universities.includes(option)
                      )
                      if (newUniversities.length > 0) {
                        setUniversities([...universities, ...newUniversities])
                      }
                    }}
                    placeholder="Other university..."
                    buttonLabel="Other University"
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
                <div className="flex flex-col xl:gap-y-1 ml-8 mt-2">
                  <AddMoreBox
                    options={topics}
                    setOptions={setTopics}
                    placeholder="Add topic..."
                    buttonLabel="Add Topic"
                  />
                  <AddUniversityBox
                    universities={universities}
                    setUniversities={setUniversities}
                    placeholder="Add university..."
                    disabled={topics.length === 0}
                    selectedTopics={topics}
                  />
                  <AddMoreBox
                    options={[]}
                    setOptions={(newOptions) => {
                      const newUniversities = newOptions.filter(
                        (option) => !universities.includes(option)
                      )
                      if (newUniversities.length > 0) {
                        setUniversities([...universities, ...newUniversities])
                      }
                    }}
                    placeholder="Other university..."
                    buttonLabel="Other University"
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
          onSkip={() => router.push(`/info/job?name=${name}`)}
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
