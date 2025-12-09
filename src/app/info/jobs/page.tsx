'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import StickyNav from '../components/StickyNav'
import AddMoreBox from './components/AddMoreBox'
import { Progress } from '@/components/ui/progress'
import { Toggle } from '@/components/ui/toggle'
import { useUpdateJob, useUpdateUser } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useJobPositions } from '@/service/jobs/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

const jobTags = ['Freelance', 'Remote', 'Part-time', 'Full-time', 'Contract', 'Internship']

const jobSchema = z.object({
  job: z.string({
    required_error: 'Please select your job status',
  }),
  positions: z.array(z.string()).optional(),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})
type JobFormData = z.infer<typeof jobSchema>

function JobContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || ''
  const isEditMode = searchParams?.get('edit') === 'true'
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: 'onChange',
    defaultValues: {
      positions: [],
      companies: [],
    },
  })
  const selectedJob = watch('job')

  const [positions, setPositions] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const jobMutation = useUpdateJob()
  const userMutation = useUpdateUser()

  const [isSignupFlow, setIsSignupFlow] = useState(false)
  
  useEffect(() => {
    const cookie = getCookie('info_job')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.job) {
          setValue('job', data.job)
        }
        if (data.positions && Array.isArray(data.positions)) {
          setPositions(data.positions)
        }
        if (data.companies && Array.isArray(data.companies)) {
          setCompanies(data.companies)
        }
        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags)
        }
      } catch {}
    }
    setIsInitialLoad(false)
    // Check if signup cookie exists
    const signupCookie = getCookie('signup')
    setIsSignupFlow(signupCookie === 'true')
  }, [setValue])

  useEffect(() => {
    if (selectedJob) {
      setCookie('info_job', JSON.stringify({ 
        job: selectedJob,
        positions,
        companies,
        tags,
      }))
    }
  }, [selectedJob, positions, companies, tags])

  const { data: jobPositions } = useJobPositions()

  useEffect(() => {
    setValue('positions', positions)
  }, [positions, setValue])

  useEffect(() => {
    setValue('companies', companies)
  }, [companies, setValue])

  useEffect(() => {
    setValue('tags', tags)
  }, [tags, setValue])

  useEffect(() => {
    // Only reset companies when positions change after initial load
    // This prevents clearing companies when loading from cookies
    if (!isInitialLoad) {
      setCompanies([])
    }
  }, [positions, isInitialLoad])

  const getAllCompaniesForPositions = () => {
    if (positions.length === 0) return []

    const allCompanies = new Set<string>()
    positions.forEach((positionName) => {
      const position = jobPositions.find((p) => p.name === positionName)
      if (position) {
        position.companies.forEach((company) => allCompanies.add(company))
      }
    })

    return Array.from(allCompanies)
  }

  const onSubmit = async (data: JobFormData) => {
    if (!data.job) {
      if (isEditMode) {
        return router.push('/bio')
      } else {
        return router.push(`/info/set-profile?name=${name}`)
      }
    }

    try {
      if (data.job === 'employed') {
        // Update job status
        await userMutation.mutateAsync({
          jobStatus: 'employed',
        })

        const jobData = {
          position: data.positions && data.positions.length > 0 ? data.positions.join(', ') : null,
          company: data.companies && data.companies.length > 0 ? data.companies.join(', ') : null,
          tags: data.tags && data.tags.length > 0 ? data.tags : null,
        }

        await jobMutation.mutateAsync(jobData)
      } else if (data.job === 'unemployed') {
        // Update job status and clear job details
        await userMutation.mutateAsync({
          jobStatus: 'unemployed',
        })

        await jobMutation.mutateAsync({
          position: null,
          company: null,
          tags: null,
        })
      }

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/set-profile?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to update job info', err)
      // Don't navigate on error
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={32.1} />
      <Header className="mt-4" showTickButton={!isSignupFlow} showBackButton={isSignupFlow} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal">Tell us about your work experience.</span>
          </div>
          <div className="space-y-5 mt-10">
            <h2 className="text-xl font-bold">What is your employment status?</h2>
            <div className="space-y-2.5">
              <SelectableOption
                id="employed"
                label="Employed"
                checked={selectedJob === 'employed'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('job', 'employed')
                  }
                }}
              />
              {selectedJob === 'employed' && (
                <div className="flex flex-col xl:gap-y-1 ml-8 mt-2">
                  <AddMoreBox
                    options={positions}
                    setOptions={setPositions}
                    placeholder="Add position..."
                    buttonLabel="Add Position"
                    staticOptions={jobPositions.map((p) => p.name)}
                  />
                  <AddMoreBox
                    options={companies}
                    setOptions={setCompanies}
                    placeholder="Add company..."
                    buttonLabel="Add Company"
                    disabled={positions.length === 0}
                    staticOptions={getAllCompaniesForPositions()}
                  />
                  {(positions.length > 0 || companies.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {jobTags.map((tag) => (
                        <Toggle
                          key={tag}
                          pressed={tags.includes(tag)}
                          onPressedChange={() => {
                            if (tags.includes(tag)) {
                              setTags(tags.filter((t) => t !== tag))
                            } else {
                              setTags([...tags, tag])
                            }
                          }}
                          className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border border-black hover:text-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full"
                        >
                          {tag}
                        </Toggle>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <SelectableOption
                id="unemployed"
                label="Unemployed"
                checked={selectedJob === 'unemployed'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('job', 'unemployed')
                  }
                }}
              />
              <div className="flex items-center gap-1 text-xs mt-4">
                <Info className="size-4" />
                <span>You can always update this later</span>
              </div>
              {errors.job && <div className="text-red-500 text-sm mt-2">{errors.job.message}</div>}
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/set-profile?name=${name}`)
            }
          }}
          className="mt-8"
          loading={jobMutation.isPending || userMutation.isPending}
        />
      </form>
    </div>
  )
}
export default function Job() {
  return (
    <Suspense>
      <JobContent />
    </Suspense>
  )
}
