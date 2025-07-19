'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import CalculateAge from './components/CalculateAge'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect, useMemo } from 'react'
import DatePicker, { PickerOptions } from '@/app/info/components/DataPicker'

const birthdaySchema = z.object({
  birthday: z.date({
    required_error: 'Please select your birthday',
  }),
})
type BirthdayFormData = z.infer<typeof birthdaySchema>

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString())

function BirthdayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  let name = searchParams.get('name') || ''
  if (!name && typeof window !== 'undefined') {
    const cookie = getCookie('info_name')
    if (cookie) {
      try {
        name = JSON.parse(decodeURIComponent(cookie))
      } catch {}
    }
  }
  const years = useMemo(() => range(1980, new Date().getFullYear()), [])
  const months = useMemo(() => range(1, 12), [])
  const days = useMemo(() => range(1, 31), [])
  const pickers: PickerOptions = useMemo(
    () => ({
      year: years,
      month: months,
      day: days,
    }),
    [years, months, days]
  )

  const [selected, setSelected] = useState<Record<string, string>>({
    day: 'Exp: 30',
    month: 'Exp: 12',
    year: 'Exp: 1997',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookie = getCookie('info_birthday')
      if (cookie) {
        try {
          setSelected(JSON.parse(decodeURIComponent(cookie)))
        } catch {}
      }
    }
  }, [])

  const handleSetSelected = (val: Record<string, string>) => {
    setSelected(val)
    setCookie('info_birthday', JSON.stringify(val))
  }

  const {
    handleSubmit,
    setValue,
    register,
    formState: {},
    trigger,
  } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    mode: 'onChange',
  })

  // Check if all date fields are properly selected (not default "Exp:" values)
  const isAllFieldsSelected = useMemo(() => {
    const day = selected.day
    const month = selected.month
    const year = selected.year

    return !day.startsWith('Exp:') && !month.startsWith('Exp:') && !year.startsWith('Exp:')
  }, [selected])

  useEffect(() => {
    const y = Number(selected.year.replace(/^Exp:\s*/, ''))
    const m = Number(selected.month.replace(/^Exp:\s*/, ''))
    const d = Number(selected.day.replace(/^Exp:\s*/, ''))
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      setValue('birthday', new Date(y, m - 1, d))
      trigger('birthday') // Trigger validation after setting value
    }
  }, [selected, setValue, trigger])

  const onSubmit = () => {
    if (isAllFieldsSelected) {
      router.push(`/info/gender?name=${name}`)
    }
  }

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
              We love that you&apos;re here. pick youre birthday date.
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
            <input type="hidden" {...register('birthday')} />
            <CalculateAge year={selected.year} month={selected.month} day={selected.day} />
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
