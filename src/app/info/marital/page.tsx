'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

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
    router.push(`/info/education?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={21.42} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal">
              pick the marital status that best describes you.
            </span>
          </div>
          <div className="space-y-6 mt-20">
            <h2 className="text-xl font-bold">Which is your marital status?</h2>
            <div className="space-y-2.5">
              <SelectableOption
                id="married"
                label="Married"
                checked={selectedMarital === 'married'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'married')
                  }
                }}
              />
              <SelectableOption
                id="single"
                label="Single"
                checked={selectedMarital === 'single'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'single')
                  }
                }}
              />
              <SelectableOption
                id="divorced"
                label="Divorced"
                checked={selectedMarital === 'divorced'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'divorced')
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
        <div className="sticky bottom-0">
          <Button
            type="submit"
            className="w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
          >
            Next
          </Button>
          <button
            type="button"
            className="w-full text-sm font-normal p-3.5 mt-2 rounded-4xl"
            onClick={() => router.push(`/info/education?name=${name}`)}
          >
            skip
          </button>
        </div>
      </form>
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
