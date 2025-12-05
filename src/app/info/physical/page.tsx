'use client'
import { z } from 'zod'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { useUpdateUser } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState, useEffect } from 'react'
import DatePicker, { PickerOptions } from '@/app/info/components/DataPicker'

const physicalSchema = z.object({
  height: z.string().min(1, 'Height is required.').regex(/^\d+$/, 'just number'),
  weight: z.string().min(1, 'Weight is required.').regex(/^\d+$/, 'just number'),
})
type PhysicalFormData = z.infer<typeof physicalSchema>

function PhysicalContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || ''
  const isEditMode = searchParams?.get('edit') === 'true'
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

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_physical')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        setSelected(data)
      } catch {}
    }
  }, [])
  const handleSetSelected = (val: Record<string, string>) => {
    setSelected(val)
    setCookie('info_physical', JSON.stringify(val))
  }
  const isValid =
    (selected.height && !selected.height.startsWith('Exp:')) ||
    (selected.weight && !selected.weight.startsWith('Exp:'))
  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!isValid) return

    try {
      await mutation.mutateAsync({
        height:
          selected.height && !selected.height.startsWith('Exp:')
            ? Number(selected.height.replace(/\D/g, ''))
            : isEditMode
            ? null
            : undefined,
        weight:
          selected.weight && !selected.weight.startsWith('Exp:')
            ? Number(selected.weight.replace(/\D/g, ''))
            : isEditMode
            ? null
            : undefined,
      })

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/born?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to update physical info', err)
      // Don't navigate on error
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={50.04} />
      <Header className="mt-4" showBackButton isEditMode={isEditMode} />
      <form onSubmit={onSubmit} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
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
        <StickyNav
          onNext={onSubmit}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/born?name=${name}`)
            }
          }}
          loading={mutation.isPending}
        />
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
