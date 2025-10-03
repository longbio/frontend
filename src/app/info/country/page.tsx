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
const countrySchema = z
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
type CountryFormData = z.infer<typeof countrySchema>

function CountryContent() {
  const router = useRouter()
  const { mutateAsync: updateUser } = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    mode: 'onChange',
    defaultValues: {},
  })

  const birthPlace = watch('birthPlace')
  const livePlace = watch('livePlace')

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_country')
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
    setCookie('info_country', JSON.stringify({ birthPlace, livePlace }))
  }, [birthPlace, livePlace])

  const onSubmit = async (data: CountryFormData) => {
    try {
      // eslint-disable-next-line
      const updateData: any = {}

      if (data.birthPlace) {
        updateData.bornPlace = data.birthPlace
      }

      if (data.livePlace) {
        updateData.livePlace = data.livePlace
      }

      await updateUser(updateData)

      router.push(`/info/pet?name=${name}`)
    } catch (err) {
      console.error('Failed to update country info', err)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={57.18} />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">Choose your country.</span>
          </div>

          <div className="flex flex-col space-y-6 w-full mt-20">
            <div>
              <label className="text-xl font-bold block mb-2">The place where you were born</label>
              <input
                {...register('birthPlace')}
                type="text"
                placeholder="Exp: isfahan"
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
                placeholder="Exp: tehran"
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
          onSkip={() => router.push(`/info/pet?name=${name}`)}
        />
      </form>
    </div>
  )
}

export default function Country() {
  return (
    <Suspense>
      <CountryContent />
    </Suspense>
  )
}
