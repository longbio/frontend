'use client'
import { z } from 'zod'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import React, { Suspense, useEffect } from 'react'
import { useUpdateUser } from '@/service/user/hook'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'

// Schema
const bornSchema = z
  .object({
    birthPlace: z
      .string()
      .refine((val) => !val || /^[a-zA-Zآ-ی\s]+$/.test(val), 'Only letters and spaces allowed'),
    livePlace: z
      .string()
      .refine((val) => !val || /^[a-zA-Zآ-ی\s]+$/.test(val), 'Only letters and spaces allowed'),
  })
  .refine((data) => data.birthPlace || data.livePlace, {
    message: 'At least one field is required',
    path: ['birthPlace'],
  })
type BornFormData = z.infer<typeof bornSchema>

function BornContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || ''
  const isEditMode = searchParams?.get('edit') === 'true'

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<BornFormData>({
    resolver: zodResolver(bornSchema),
    mode: 'onChange',
    defaultValues: {},
  })

  const birthPlace = watch('birthPlace')
  const livePlace = watch('livePlace')

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_born')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.birthPlace) {
          setValue('birthPlace', data.birthPlace)
        }
        if (data.livePlace) {
          setValue('livePlace', data.livePlace)
        }
      } catch {}
    }
  }, [setValue])

  useEffect(() => {
    setCookie('info_born', JSON.stringify({ birthPlace, livePlace }))
  }, [birthPlace, livePlace])

  const onSubmit = async (data: BornFormData) => {
    try {
      const updateData: Record<string, string> = {}

      if (data.birthPlace) {
        updateData.bornPlace = data.birthPlace
      }

      if (data.livePlace) {
        updateData.livePlace = data.livePlace
      }

      await mutation.mutateAsync(updateData)

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/pets?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to update country info', err)
      // Don't navigate on error
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={57.18} />
      <Header className="mt-4" showBackButton isEditMode={isEditMode} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Where were you born and where do you live?
            </span>
          </div>

          <div className="flex flex-col space-y-6 w-full mt-20">
            <div>
              <label className="text-xl font-bold block mb-2">The place where you were born</label>
              <input
                {...register('birthPlace')}
                type="text"
                placeholder="Exp: london"
                className={
                  errors.birthPlace
                    ? 'w-full border-red-500 focus-visible:ring-red-500/50 rounded-full px-4 py-2 text-sm mt-3'
                    : 'w-full border rounded-full px-4 py-2 text-sm mt-3'
                }
              />
              {errors.birthPlace && (
                <span className="text-red-500 text-xs mt-1 block">{errors.birthPlace.message}</span>
              )}
            </div>

            <div>
              <label className="text-xl font-bold block mb-2">The place where you live</label>
              <input
                {...register('livePlace')}
                type="text"
                placeholder="Exp: london"
                className={
                  errors.livePlace
                    ? 'w-full border-red-500 focus-visible:ring-red-500/50 rounded-full px-4 py-2 text-sm mt-3'
                    : 'w-full border rounded-full px-4 py-2 text-sm mt-3'
                }
              />
              {errors.livePlace && (
                <span className="text-red-500 text-xs mt-1 block">{errors.livePlace.message}</span>
              )}
            </div>
          </div>
        </div>

        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/pets?name=${name}`)
            }
          }}
          loading={mutation.isPending}
        />
      </form>
    </div>
  )
}

export default function Born() {
  return (
    <Suspense>
      <BornContent />
    </Suspense>
  )
}
