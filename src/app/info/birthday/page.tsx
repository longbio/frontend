'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import DatePicker, { PickerOptions } from '@/app/info/components/DataPicker'

const birthdaySchema = z.object({
  birthday: z.date({
    required_error: 'Please select your birthday',
  }),
})
type BirthdayFormData = z.infer<typeof birthdaySchema>

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString())
const years = range(1980, new Date().getFullYear())
const months = range(1, 12)
const days = range(1, 31)
const pickers: PickerOptions = {
  day: days,
  month: months,
  year: years,
}

function BirthdayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    mode: 'onChange',
  })
  const onSubmit = () => {
    router.push(`/info/gender?name=${name}`)
  }

  const [selected, setSelected] = useState<Record<string, string>>({
    year: 'Exp: 1997',
    month: 'Exp: 12',
    day: 'Exp: 30',
  })
  const handleSetSelected = (val: Record<string, string>) => setSelected(val)

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={7.14} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal">
              We love that you’re here. pick youre birthday date.
            </span>
          </div>
          <div className="space-y-6 mt-30">
            <h2 className="text-xl font-bold">Your birthday</h2>
            <DatePicker
              pickers={pickers}
              selected={selected}
              setSelected={handleSetSelected}
              triggerClassNames={{
                year: 'min-w-[142px] md:min-w-[180px] h-fit border-none shadow-none bg-cloud-mist rounded-full',
                month:
                  'min-w-[85px] md:min-w-[105px] h-fit border-none shadow-none bg-cloud-mist rounded-full',
                day: 'min-w-[85px] md:min-w-[105px] h-fit border-none shadow-none bg-cloud-mist rounded-full',
              }}
            />
            <div className="flex items-center gap-1 mt-5 text-xs">
              <Info className="size-4" />
              <span>You can always update this later</span>
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
            onClick={() => router.push(`/info/gender?name=${name}`)}
          >
            skip
          </button>
        </div>
      </form>
    </div>
  )
}
export default function Birthday() {
  return (
    <Suspense>
      <BirthdayContent />
    </Suspense>
  )
}
