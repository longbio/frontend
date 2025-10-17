'use client'
import { z } from 'zod'
import React from 'react'
import { Suspense } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import { useUpdateUser } from '@/service/user/hook'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'

const maritalSchema = z.object({
  marital: z.string({
    required_error: 'Please select your marital',
  }),
})
type MaritalFormData = z.infer<typeof maritalSchema>

function MaritalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const isEditMode = searchParams.get('edit') === 'true'
  const { handleSubmit, setValue, watch } = useForm<MaritalFormData>({
    resolver: zodResolver(maritalSchema),
    mode: 'onChange',
    defaultValues: {},
  })
  const selectedMarital = watch('marital')
  const mutation = useUpdateUser()

  // Load cookie values on client side only
  React.useEffect(() => {
    const cookie = getCookie('info_marital')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.marital) {
          setValue('marital', data.marital)
        }
      } catch {}
    }
  }, [setValue])

  React.useEffect(() => {
    if (selectedMarital) setCookie('info_marital', JSON.stringify({ marital: selectedMarital }))
  }, [selectedMarital])

  const onSubmit = async () => {
    if (selectedMarital) {
      try {
        await mutation.mutateAsync({ maritalStatus: selectedMarital })
      } catch (err) {
        console.error('Failed to update marital', err)
      }
    }

    // If in edit mode, return to bio page, otherwise continue to next step
    if (isEditMode) {
      router.push('/bio')
    } else {
      router.push(`/info/education?name=${name}`)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={21.42} />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal">
              pick the marital status that best describes you.
            </span>
          </div>
          <div className="space-y-6 mt-16">
            <h2 className="text-xl font-bold">Which is your marital status?</h2>
            <div className="space-y-2.5">
              <SelectableOption
                id="married"
                label="Married"
                checked={selectedMarital === 'married'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'married')
                  }
                }}
              />
              <SelectableOption
                id="single"
                label="Single"
                checked={selectedMarital === 'single'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'single')
                  }
                }}
              />
              <SelectableOption
                id="in-relationship"
                label="in-relationship"
                checked={selectedMarital === 'in-relationship'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'in-relationship')
                  }
                }}
              />
              <SelectableOption
                id="divorced"
                label="Divorced"
                checked={selectedMarital === 'divorced'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'divorced')
                  }
                }}
              />
              <SelectableOption
                id="widowed"
                label="Widowed"
                checked={selectedMarital === 'widowed'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('marital', 'widowed')
                  }
                }}
              />
              <div className="flex items-center gap-1 text-xs mt-4">
                <Info className="size-4" />
                <span>You can always update this later</span>
              </div>
            </div>
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/education?name=${name}`)
            }
          }}
        />
      </form>
    </div>
  )
}
export default function Marital() {
  return (
    <Suspense>
      <MaritalContent />
    </Suspense>
  )
}
