'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Progress } from '@/components/ui/progress'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCountriesAndCities } from '@/service/countries'
import { useRouter, useSearchParams } from 'next/navigation'
import StickyNav from '../components/StickyNav'

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
    country: z.array(z.string()).optional(),
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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {},
  } = useForm({
    resolver: zodResolver(travelSchema),
    defaultValues: { styles: [], country: [] },
    mode: 'onChange',
  })

  // Country selection state
  const { data, loading } = useCountriesAndCities()
  const [countryInput, setCountryInput] = useState('')
  const selectedCountries = watch('country') || []

  // Filtered country suggestions
  const countrySuggestions = useMemo(() => {
    if (!data?.data) return []
    const selected = watch('country') || []
    return data.data
      .map((c) => c.country)
      .filter(
        (country) =>
          country.toLowerCase().includes(countryInput.toLowerCase()) && !selected.includes(country)
      )
      .slice(0, 10)
  }, [data, countryInput, watch])

  const handleAddCountry = (country: string) => {
    if (selectedCountries.length >= 5) return
    const updated = [...selectedCountries, country]
    setValue('country', updated, { shouldValidate: true })
    setCountryInput('')
  }

  const handleRemoveCountry = (country: string) => {
    const updated = selectedCountries.filter((c: string) => c !== country)
    setValue('country', updated, { shouldValidate: true })
  }

  const onSubmit = () => {
    router.push(`/info/physical?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress className="shrink-0" value={42.9} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> Long-Bio, {name}!
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
                disabled={loading || selectedCountries.length >= 5}
                className="mt-3"
              />
              {countryInput && countrySuggestions.length > 0 && (
                <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
                  {countrySuggestions.map((country) => (
                    <button
                      key={country}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                      onClick={() => handleAddCountry(country)}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCountries.map((country: string) => (
                <Toggle
                  key={country}
                  pressed={true}
                  onPressedChange={() => handleRemoveCountry(country)}
                  variant="outline"
                  className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border-black px-2 xl:px-4 text-xs xl:text-sm font-normal transition rounded-full"
                >
                  {country}
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
