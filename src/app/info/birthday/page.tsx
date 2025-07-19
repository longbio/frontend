'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import StickyNav from '../components/StickyNav'
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
  year: years,
  month: months,
  day: days,
}

function calculateAge(year: string, month: string, day: string): number | null {
  if (!year || !month || !day) return null
  const clean = (val: string) => val.replace(/^Exp:\s*/, '')
  const y = Number(clean(year))
  const m = Number(clean(month))
  const d = Number(clean(day))
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  const birthDate = new Date(y, m - 1, d)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const mDiff = today.getMonth() - birthDate.getMonth()
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function BirthdayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const [selected, setSelected] = useState<Record<string, string>>({
    day: 'Exp: 30',
    month: 'Exp: 12',
    year: 'Exp: 1997',
  })
  const handleSetSelected = (val: Record<string, string>) => setSelected(val)

  const isValid =
    selected.year &&
    selected.month &&
    selected.day &&
    !selected.year.startsWith('Exp:') &&
    !selected.month.startsWith('Exp:') &&
    !selected.day.startsWith('Exp:')

  const { handleSubmit } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    mode: 'onChange',
  })
  const onSubmit = () => {
    if (isValid) {
      router.push(`/info/gender?name=${name}`)
    }
  }

  const age = calculateAge(selected.year, selected.month, selected.day)

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
          <div className="space-y-6 mt-16">
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
            {age !== null &&
              !selected.year.startsWith('Exp:') &&
              !selected.month.startsWith('Exp:') &&
              !selected.day.startsWith('Exp:') && (
                <div className="flex items-center justify-center mt-4 text-sm font-medium text-gray-700">
                  <h3>Your age is</h3>
                  <h2 className="mx-1 text-gray-400">{age}</h2>
                </div>
              )}
            <div className="flex items-center gap-1 mt-12 text-xs">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => router.push(`/info/gender?name=${name}`)}
        />
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
