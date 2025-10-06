'use client'

import { z } from 'zod'
import Image from 'next/image'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import StickyNav from '../components/StickyNav'
import { useUpdateUser } from '@/service/user/hook'
import { Progress } from '@/components/ui/progress'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import type { TravelItem } from '@/service/user/type'
import { setCookie, getCookie } from '@/utils/cookie'
import { useFlagCountries } from '@/service/countries'
import type { CountryItem } from '@/service/countries/types'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState, useEffect, Suspense } from 'react'

const travelStyles = [
  'Luxury Travel',
  'Backpacking',
  'Adventure Travel',
  'Cultural Travel',
  'Road Trip',
  'Eco-Tourism',
  'Solo Travel',
  'Family Travel',
  'Volunteer Travel',
]

const travelSchema = z
  .object({
    styles: z.array(z.string()).optional(),
    country: z.array(z.any()).optional(),
  })
  .refine(
    (data) => (data.styles && data.styles.length > 0) || (data.country && data.country.length > 0),
    {
      message: 'choose one',
      path: ['form'],
    }
  )

function TravelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(travelSchema),
    defaultValues: { styles: [], country: [] },
    mode: 'onChange',
  })

  const styles = watch('styles')
  const country = watch('country')
  const { mutateAsync: updateUser } = useUpdateUser()

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_travel')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.styles) {
          setValue('styles', data.styles)
        }
        if (data.country) {
          setValue('country', data.country)
        }
      } catch {}
    }
  }, [setValue])

  useEffect(() => {
    setCookie('info_travel', JSON.stringify({ styles, country }))
  }, [styles, country])

  // Country selection state
  const { data, loading } = useFlagCountries()
  const [countryInput, setCountryInput] = useState('')
  // eslint-disable-next-line
  const selectedCountries: CountryItem[] = watch('country') || []

  // Filtered country suggestions
  const countrySuggestions = useMemo(() => {
    if (!data) return []
    return data
      .filter(
        (c: CountryItem) =>
          c.name.toLowerCase().includes(countryInput.toLowerCase()) &&
          !selectedCountries.some((s: CountryItem) => s.code === c.code)
      )
      .slice(0, 10)
  }, [data, countryInput, selectedCountries])

  const handleAddCountry = (country: CountryItem) => {
    const updated = [...selectedCountries, country]
    setValue('country', updated, { shouldValidate: true })
    setCountryInput('')
  }

  const handleRemoveCountry = (country: CountryItem) => {
    const updated = selectedCountries.filter((c: CountryItem) => c.code !== country.code)
    setValue('country', updated, { shouldValidate: true })
  }

  const onSubmit = async () => {
    try {
      await updateUser({
        travelStyle: styles && styles.length > 0 ? styles[0] : 'None',
      })
    } catch (err) {
      console.error('Failed to update travel info', err)
    }

    router.push(`/info/physical?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress className="shrink-0" value={42.9} />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal">Pick your travel style.</span>
          </div>

          <div className="space-y-4 mt-16">
            <h2 className="text-xl font-bold">What&apos;s your travel style?</h2>
            <Controller
              name="styles"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap justify-center-safe md:justify-stretch gap-1.5 md:gap-2">
                  {travelStyles.map((style) => (
                    <Toggle
                      key={style}
                      pressed={field.value?.includes(style)}
                      onPressedChange={(pressed) => {
                        if (pressed) {
                          field.onChange([...(field.value || []), style])
                        } else {
                          field.onChange((field.value || []).filter((s: string) => s !== style))
                        }
                      }}
                      variant="outline"
                      className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full"
                    >
                      {style}
                    </Toggle>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="my-16">
            <h2 className="text-xl font-bold">Which countries are on your bucket list?</h2>
            <div className="relative">
              <Input
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                placeholder="Type to search countries..."
                disabled={loading}
                className="mt-3"
              />
              {countryInput && countrySuggestions.length > 0 && (
                <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
                  {countrySuggestions.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                      onClick={() => handleAddCountry(c)}
                    >
                      <Image
                        src={c.image}
                        alt={c.name}
                        width={24}
                        height={16}
                        className="object-contain rounded-sm"
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCountries.map((c) => (
                <Toggle
                  key={c.code}
                  pressed={true}
                  onPressedChange={() => handleRemoveCountry(c)}
                  variant="outline"
                  className="flex items-center justify-center size-10 p-1 rounded-full border"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={24}
                    height={16}
                    className="object-contain rounded-sm"
                  />
                </Toggle>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs mt-2">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
        </div>

        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => router.push(`/info/physical?name=${name}`)}
        />
      </form>
    </div>
  )
}

export default function Travel() {
  return (
    <Suspense>
      <TravelContent />
    </Suspense>
  )
}
