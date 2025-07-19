'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

const genderSchema = z.object({
  gender: z.string({
    required_error: 'Please select your gender',
  }),
})
type GenderFormData = z.infer<typeof genderSchema>

function GenderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue, watch } = useForm<GenderFormData>({
    resolver: zodResolver(genderSchema),
    mode: 'onChange',
  })
  const selectedGender = watch('gender')

  const onSubmit = () => {
    router.push(`/info/marital?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={14.28} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal">pick the gender that best describe you. </span>
          </div>
          <div className="space-y-6 mt-16">
            <h2 className="text-xl font-bold">Which gender best describe you?</h2>
            <div className="SelectableOption space-y-2.5">
              <SelectableOption
                id="male"
                label="Man"
                checked={selectedGender === 'male'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'male')
                  }
                }}
              />
              <SelectableOption
                id="female"
                label="Woman"
                checked={selectedGender === 'female'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'female')
                  }
                }}
              />
              <SelectableOption
                id="Nonbinary"
                label="Nonbinary"
                checked={selectedGender === 'Nonbinary'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'Nonbinary')
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
          onSkip={() => router.push(`/info/marital?name=${name}`)}
        />
      </form>
    </div>
  )
}
export default function Gender() {
  return (
    <Suspense>
      <GenderContent />
    </Suspense>
  )
}
