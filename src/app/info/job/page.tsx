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
import { useUpdateUser } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useJobPositions } from '@/service/jobs/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

const jobSchema = z.object({
  job: z.string({
    required_error: 'Please select your job status',
  }),
})
type JobFormData = z.infer<typeof jobSchema>

function JobContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue, watch } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: 'onChange',
    defaultValues: {},
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
  const mutation = useUpdateUser()

  const { data: jobPositions } = useJobPositions()

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

  const onSubmit = async () => {
    if (!selectedJob) return router.push(`/info/set-profile?name=${name}`)

    const jobStatus =
      selectedJob === 'not-interested'
        ? 'not interested'
        : selectedJob === 'employed'
        ? 'employed'
        : 'unemployed'

    try {
      // eslint-disable-next-line
      const updateData: any = {
        jobStatus,
      }

      if (selectedJob === 'employed') {
        // eslint-disable-next-line
        const jobData: any = {}

        if (positions.length > 0) {
          jobData.position = positions.join(', ')
        }

        if (companies.length > 0) {
          jobData.company = companies.join(', ')
        }

        if (Object.keys(jobData).length > 0) {
          updateData.job = jobData
        }
      }

      await mutation.mutateAsync(updateData)
    } catch (err) {
      console.error('Failed to update job info', err)
    }

    router.push(`/info/set-profile?name=${name}`)
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
              <SelectableOption
                id="not-interested"
                label="Not interested in work"
                checked={selectedJob === 'not-interested'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('job', 'not-interested')
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
export default function Job() {
  return (
    <Suspense>
      <JobContent />
    </Suspense>
  )
}
