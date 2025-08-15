'use client'
import { z } from 'zod'
import React, { Suspense, useEffect } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCountriesAndCities } from '@/service/countries'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// Schema
const countrySchema = z.object({
  birthPlace: z
    .string()
    .min(1, 'Entering place of birth is required.')
    .regex(/^[a-zA-Zآ-ی\s]+$/),
  livePlace: z
    .string()
    .min(1, 'Entering your place of residence is required.')
    .regex(/^[a-zA-Zآ-ی\s]+$/),
})
type CountryFormData = z.infer<typeof countrySchema>

function CountryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  const { data: countriesData, loading, error } = useCountriesAndCities()

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    mode: 'onChange',
    defaultValues: (() => {
      if (typeof window !== 'undefined') {
        const cookie = getCookie('info_country')
        if (cookie) {
          try {
            return JSON.parse(decodeURIComponent(cookie))
          } catch {}
        }
      }
      return {}
    })(),
  })

  const birthPlace = watch('birthPlace')
  const livePlace = watch('livePlace')

  useEffect(() => {
    setCookie('info_country', JSON.stringify({ birthPlace, livePlace }))
  }, [birthPlace, livePlace])

  const onSubmit = () => router.push(`/info/pet?name=${name}`)

  // پیدا کردن کشور انتخاب شده برای دسترسی به شهرها
  const selectedCountryObj = countriesData.find((c) => c.country === birthPlace)

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={57.18} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">Choose your country.</span>
          </div>

          <div className="flex flex-col space-y-6 w-full mt-20">
            {/* Country Select */}
            <div>
              <label className="text-xl font-bold block mb-2">Country of Birth</label>
              <Select
                value={birthPlace || ''}
                onValueChange={(value) => setValue('birthPlace', value, { shouldValidate: true })}
                disabled={loading || !!error}
              >
                <SelectTrigger
                  className={
                    errors.birthPlace
                      ? 'w-full border-red-500 focus-visible:ring-red-500/50 rounded-full'
                      : 'w-full border rounded-full px-4 py-2 text-sm mt-3'
                  }
                >
                  <SelectValue placeholder="Select your country..." />
                </SelectTrigger>
                <SelectContent>
                  {countriesData.map((c) => (
                    <SelectItem key={c.country} value={c.country}>
                      {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.birthPlace && (
                <span className="text-red-500 text-xs mt-1 block">{errors.birthPlace.message}</span>
              )}
            </div>

            {/* City Select */}
            <div>
              <label className="text-xl font-bold block mb-2">City of Birth</label>
              <Select
                value={livePlace || ''}
                onValueChange={(value) => setValue('livePlace', value, { shouldValidate: true })}
                disabled={!selectedCountryObj || loading || !!error}
              >
                <SelectTrigger
                  className={
                    errors.livePlace
                      ? 'w-full border-red-500 focus-visible:ring-red-500/50 rounded-full'
                      : 'w-full border rounded-full px-4 py-2 text-sm mt-3'
                  }
                >
                  <SelectValue placeholder="Select your city..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountryObj?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
