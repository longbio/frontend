'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

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
    <div className="flex flex-col min-h-screen w-full p-8">
      <Progress value={12.5} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-2 space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">pick the gender that best describe you. </span>
        <div className="space-y-6 mt-24">
          <h2 className="text-xl font-bold">Which gender best describe you?</h2>
          <div className="space-y-2.5">
            <label
              htmlFor="male"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Man
              </h2>
              <Checkbox
                id="male"
                checked={selectedGender === 'male'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'male')
                  }
                }}
              />
            </label>
            <label
              htmlFor="female"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Woman
              </h2>
              <Checkbox
                id="female"
                checked={selectedGender === 'female'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'female')
                  }
                }}
              />
            </label>
            <label
              htmlFor="Nonbinary"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nonbinary
              </h2>
              <Checkbox
                id="Nonbinary"
                checked={selectedGender === 'Nonbinary'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('gender', 'Nonbinary')
                  }
                }}
              />
            </label>
            <div className="flex items-center gap-1 text-xs mt-4">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-full bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
        >
          Next
        </Button>
      </form>
      <button
        type="button"
        className="w-full text-sm font-normal mt-2 rounded-4xl"
        onClick={() => router.push(`/info/marital?name=${name}`)}
      >
        skip
      </button>
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
