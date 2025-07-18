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

const sportSchema = z.object({
  exercise: z.enum(['yes', 'no', 'sometimes'], { required_error: 'انتخاب الزامی است' }),
  sportName: z.string().optional(),
})
type SportFormType = z.infer<typeof sportSchema>

function SportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SportFormType>({
    resolver: zodResolver(sportSchema),
    mode: 'onChange',
    defaultValues: { exercise: undefined },
  })
  const exercise = watch('exercise')

  const onSubmit = () => {
    router.push(`/info/skill?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={71.46} className="shrink-0" />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">Are you into sport?</span>
          </div>
          <div className="flex flex-col space-y-6 w-full mt-10">
            <span className="text-xl font-bold">do you exercise</span>
            <SelectableOption
              id="exerciseYes"
              label="Yes I love it!"
              checked={exercise === 'yes'}
              onCheckedChange={() => setValue('exercise', 'yes', { shouldValidate: true })}
              className="mb-2"
            />
            <SelectableOption
              id="exerciseNo"
              label="No I don't."
              checked={exercise === 'no'}
              onCheckedChange={() => setValue('exercise', 'no', { shouldValidate: true })}
              className="mb-2"
            />
            <SelectableOption
              id="exerciseSometimes"
              label="Sometimes"
              checked={exercise === 'sometimes'}
              onCheckedChange={() => setValue('exercise', 'sometimes', { shouldValidate: true })}
            />
          </div>
          {exercise === 'yes' && (
            <div className="flex flex-col space-y-6 w-full mt-6 transition-all duration-500 ease-in-out opacity-100 translate-y-0">
              <LabeledInput
                placeholder="Exp: Tennis"
                type="text"
                error={!!errors.sportName}
                {...register('sportName')}
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
            onClick={() => router.push(`/info/skill?name=${name}`)}
          >
            skip
          </button>
        </div>
      </form>
    </div>
  )
}
export default function Sport() {
  return (
    <Suspense>
      <SportContent />
    </Suspense>
  )
}
