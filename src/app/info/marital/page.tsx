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

const maritalSchema = z.object({
  marital: z.string({
    required_error: 'Please select your marital',
  }),
})
type MaritalFormData = z.infer<typeof maritalSchema>

function MaritalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue, watch } = useForm<MaritalFormData>({
    resolver: zodResolver(maritalSchema),
    mode: 'onChange',
  })
  const selectedMarital = watch('marital')

  const onSubmit = () => {
    router.push(`/info/educational?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={18.75} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-2 space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">
          pick the marital status that best describes you.
        </span>
        <div className="space-y-6 mt-18">
          <h2 className="text-xl font-bold">Which is your marital status?</h2>
          <div className="space-y-2.5">
            <label
              htmlFor="married"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Married
              </h2>
              <Checkbox
                id="married"
                checked={selectedMarital === 'married'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'married')
                  }
                }}
              />
            </label>
            <label
              htmlFor="single"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Single
              </h2>
              <Checkbox
                id="single"
                checked={selectedMarital === 'single'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'single')
                  }
                }}
              />
            </label>
            <label
              htmlFor="divorced"
              className="flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full"
            >
              <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Divorced
              </h2>
              <Checkbox
                id="divorced"
                checked={selectedMarital === 'divorced'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'divorced')
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
          className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
        >
          Next
        </Button>
      </form>
      <button
        type="button"
        className="w-full text-sm font-normal mt-2 rounded-4xl"
        onClick={() => router.push(`/info/educational?name=${name}`)}
      >
        skip
      </button>
    </div>
  )
}
export default function Marital() {
  return (
    <Suspense>
      <MaritalContent />
    </Suspense>
  )
}
