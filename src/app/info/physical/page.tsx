'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import LabeledInput from '../components/LabeledInput'
import { useRouter, useSearchParams } from 'next/navigation'

const physicalSchema = z.object({
  height: z.string().min(1, 'Height is required.').regex(/^\d+$/, 'قد باید فقط عدد باشد'),
  weight: z.string().min(1, 'Weight is required.').regex(/^\d+$/, 'وزن باید فقط عدد باشد'),
})
type PhysicalFormData = z.infer<typeof physicalSchema>

function PhysicalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhysicalFormData>({
    resolver: zodResolver(physicalSchema),
    mode: 'onChange',
  })
  const onSubmit = () => {
    router.push(`/info/country?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={50.04} />
      <Header className="mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow justify-start items-center mt-2 space-y-4"
      >
        <h1 className="text-2xl font-bold text-left w-full">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal text-left w-full">Enter your height and weight</span>
        <div className="flex flex-col space-y-6 w-full mt-16">
          <LabeledInput
            label="Height (cm)"
            placeholder="Exp: 173"
            inputMode="numeric"
            type="number"
            error={!!errors.height}
            {...register('height')}
          />
          <LabeledInput
            label="weight (kg)"
            placeholder="Exp: 56 Kg"
            inputMode="numeric"
            type="number"
            error={!!errors.weight}
            {...register('weight')}
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
        onClick={() => router.push(`/info/country?name=${name}`)}
      >
        skip
      </button>
    </div>
  )
}
export default function Physical() {
  return (
    <Suspense>
      <PhysicalContent />
    </Suspense>
  )
}
