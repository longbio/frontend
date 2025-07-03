'use client'
import Header from '@/components/Header'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import LabeledInput from '../components/LabeledInput'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '../components/SelectableOption'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
      <Progress value={71.46} />
      <Header className="mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow justify-start items-center mt-2 space-y-4"
      >
        <h1 className="text-2xl font-bold text-left w-full">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal text-left w-full">Are you into sport?</span>
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
              label="what sport do you do?"
              placeholder="Exp: Tennis"
              type="text"
              error={!!errors.sportName}
              {...register('sportName')}
            />
          </div>
        )}
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
        onClick={() => router.push(`/info/skill?name=${name}`)}
      >
        skip
      </button>
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
