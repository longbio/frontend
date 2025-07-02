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

const countrySchema = z.object({
  birthPlace: z
    .string()
    .min(1, 'وارد کردن محل تولد الزامی است')
    .regex(/^[a-zA-Zآ-ی\s]+$/, 'فقط حروف مجاز است'),
  livePlace: z
    .string()
    .min(1, 'وارد کردن محل زندگی الزامی است')
    .regex(/^[a-zA-Zآ-ی\s]+$/, 'فقط حروف مجاز است'),
})
type CountryFormData = z.infer<typeof countrySchema>

function CountryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    mode: 'onChange',
  })
  const onSubmit = () => {
    router.push(`/info/pet?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={57.18} />
      <Header className="mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow justify-start items-center mt-2 space-y-4"
      >
        <h1 className="text-2xl font-bold text-left w-full">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal text-left w-full">Choose your country.</span>
        <div className="flex flex-col space-y-6 w-full mt-16">
          <LabeledInput
            label="The place where you were born"
            placeholder="Exp: Isfahan"
            type="text"
            error={!!errors.birthPlace}
            {...register('birthPlace')}
          />
          <LabeledInput
            label="The place where you live"
            placeholder="Exp: Tehran"
            type="text"
            error={!!errors.livePlace}
            {...register('livePlace')}
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
        onClick={() => router.push(`/info/pet?name=${name}`)}
      >
        skip
      </button>
    </div>
  )
}
export default function Country() {
  return (
    <Suspense>
      <CountryContent />
    </Suspense>
  )
}
