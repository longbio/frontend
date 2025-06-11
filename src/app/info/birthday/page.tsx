'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from '@/app/info/birthday/components/DatePicker'

const birthdaySchema = z.object({
  birthday: z.date({
    required_error: 'Please select your birthday',
  }),
})
type BirthdayFormData = z.infer<typeof birthdaySchema>

export default function Birthday() {
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    mode: 'onChange',
  })
  const onSubmit = () => {
    router.push('/info/gender')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Progress value={6.25} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-16 space-y-6">
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">
          We love that you’re here. pick youre birthday date.
        </span>
        <div className="space-y-8 mt-36">
          <h2 className="text-xl font-bold">Your birthday</h2>
          <DatePicker onDateSelect={(date) => setValue('birthday', date)} />
          <div className="flex items-center gap-2 mt-28 text-xs">
            <Info className="size-4" />
            <span>You can always update this later</span>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-blaze text-sm font-bold mt-36 rounded-4xl"
        >
          Next
        </Button>
      </form>
    </div>
  )
}
