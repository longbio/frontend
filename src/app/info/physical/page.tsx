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

const physicalSchema = z.object({
  height: z.string().min(1, 'Height is required.').regex(/^\d+$/, 'قد باید فقط عدد باشد'),
  weight: z.string().min(1, 'Weight is required.').regex(/^\d+$/, 'وزن باید فقط عدد باشد'),
})
type PhysicalFormData = z.infer<typeof physicalSchema>

function PhysicalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {} = useForm<PhysicalFormData>({
    resolver: zodResolver(physicalSchema),
    mode: 'onChange',
  })
  // Picker options for height and weight
  const heightOptions = Array.from({ length: 121 }, (_, i) => `${100 + i} cm`) // 100-220 cm
  const weightOptions = Array.from({ length: 171 }, (_, i) => `${30 + i} kg`) // 30-200 kg
  const pickers: PickerOptions = {
    height: heightOptions,
    weight: weightOptions,
  }
  const [selected, setSelected] = useState<Record<string, string>>({
    height: 'Exp: 173 cm',
    weight: 'Exp: 56 kg',
  })
  const handleSetSelected = (val: Record<string, string>) => setSelected(val)
  const isValid =
    selected.height &&
    selected.weight &&
    !selected.height.startsWith('Exp:') &&
    !selected.weight.startsWith('Exp:')
  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isValid) {
      router.push(`/info/country?name=${name}`)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={50.04} />
      <Header className="mt-4" />
      <form onSubmit={onSubmit} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> Long-Bio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Enter your height and weight
            </span>
          </div>
          <div className="flex flex-col w-full gap-y-6 mt-20">
            <h2 className="text-xl font-bold">Your Physical Info</h2>
            <DatePicker
              pickers={pickers}
              selected={selected}
              setSelected={handleSetSelected}
              triggerClassNames={{
                height:
                  'min-w-[150px] md:min-w-[203px] h-fit border-none shadow-none bg-cloud-mist rounded-full',
                weight:
                  'min-w-[150px] md:min-w-[203px] h-fit border-none shadow-none bg-cloud-mist rounded-full',
              }}
            />
            <div className="flex items-center gap-1 mt-6 text-xs">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
        </div>
        <StickyNav onNext={onSubmit} onSkip={() => router.push(`/info/country?name=${name}`)} />
      </form>
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
