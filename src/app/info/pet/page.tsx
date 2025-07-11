'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import LabeledInput from '../components/LabeledInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '../components/SelectableOption'

const petSchema = z.object({
  hasPet: z.boolean({ required_error: 'Selection is required.' }),
  petName: z.string().optional(),
  petBreed: z.string().optional(),
})
type PetFormType = z.infer<typeof petSchema>

function PetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormType>({
    resolver: zodResolver(petSchema),
    mode: 'onChange',
    defaultValues: { hasPet: undefined },
  })
  const hasPet = watch('hasPet')

  const onSubmit = () => {
    router.push(`/info/sport?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={64.32} className="shrink-0" />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s talk about your pets.
            </span>
          </div>
          <div className="flex flex-col space-y-6 w-full mt-10">
            <span className="text-xl font-bold">Do you have pet?</span>
            <SelectableOption
              id="hasPetYes"
              label="Yes I have it!"
              checked={hasPet === true}
              onCheckedChange={() => setValue('hasPet', true, { shouldValidate: true })}
              className="mb-2"
            />
            <SelectableOption
              id="hasPetNo"
              label="No I don't."
              checked={hasPet === false}
              onCheckedChange={() => setValue('hasPet', false, { shouldValidate: true })}
            />
          </div>
          {hasPet && (
            <div className="flex flex-col space-y-6 w-full mt-6">
              <LabeledInput
                label="What is the name of your pet?"
                placeholder="Exp: Woody"
                type="text"
                error={!!errors.petName}
                {...register('petName')}
              />
              <LabeledInput
                label="What is the breed of your pet?"
                placeholder="Exp: German Shepherd"
                type="text"
                error={!!errors.petBreed}
                {...register('petBreed')}
              />
            </div>
          )}
        </div>
        <div className="sticky bottom-0 mt-9">
          <Button
            type="submit"
            className="w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
          >
            Next
          </Button>
          <button
            type="button"
            className="w-full text-sm font-normal p-3.5 mt-2 rounded-4xl"
            onClick={() => router.push(`/info/sport?name=${name}`)}
          >
            skip
          </button>
        </div>
      </form>
    </div>
  )
}
export default function Pet() {
  return (
    <Suspense>
      <PetContent />
    </Suspense>
  )
}
