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
import { useUpdateJob } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useJobPositions } from '@/service/jobs/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

const jobSchema = z
  .object({
    job: z.string({
      required_error: 'Please select your job status',
    }),
    positions: z.array(z.string()).optional(),
    companies: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.job === 'employed') {
        return (
          data.positions && data.positions.length > 0 && data.companies && data.companies.length > 0
        )
      }
      return true
    },
    {
      message: 'Please add at least one position and one company when employed',
      path: ['job'],
    }
  )
type JobFormData = z.infer<typeof jobSchema>

function JobContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const isEditMode = searchParams.get('edit') === 'true'
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

  useEffect(() => {
    const cookie = getCookie('info_job')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.job) {
          setValue('job', data.job)
        }
      } catch {}
    }
  }, [setValue])

  useEffect(() => {
    if (selectedJob) setCookie('info_job', JSON.stringify({ job: selectedJob }))
  }, [selectedJob])

  const [positions, setPositions] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const jobMutation = useUpdateJob()

  const { data: jobPositions } = useJobPositions()

  useEffect(() => {
    setValue('positions', positions)
  }, [positions, setValue])

  useEffect(() => {
    setValue('companies', companies)
  }, [companies, setValue])

  useEffect(() => {
    setCompanies([])
  }, [positions])

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
        if (
          !data.positions ||
          data.positions.length === 0 ||
          !data.companies ||
          data.companies.length === 0
        ) {
          console.error('Validation failed: missing position or company data')
          return
        }

        const jobData = {
          position: data.positions.join(', '),
          company: data.companies.join(', '),
        }

        await jobMutation.mutateAsync(jobData)
      }
    } catch (err) {
      console.error('Failed to update job info', err)
    }

    // If in edit mode, return to bio page, otherwise continue to next step
    if (isEditMode) {
      router.push('/bio')
    } else {
      router.push(`/info/set-profile?name=${name}`)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={32.1} />
      <Header className="mt-4" showBackButton />
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
                  <AddMoreBox
                    options={[]}
                    setOptions={(newOptions) => {
                      const newCompanies = newOptions.filter(
                        (option) => !companies.includes(option)
                      )
                      if (newCompanies.length > 0) {
                        setCompanies([...companies, ...newCompanies])
                      }
                    }}
                    placeholder="Add custom company..."
                    buttonLabel="Add Custom Company"
                    disabled={false}
                  />
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
