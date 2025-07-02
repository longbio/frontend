'use client'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Progress } from '@/components/ui/progress'
import { useRouter, useSearchParams } from 'next/navigation'

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

function TravelContent() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value)
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    // اینجا می‌توانید روت بعدی را ست کنید
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={42.9} />
      <Header className="mt-4" />
      <form onSubmit={handleNext} className="flex flex-col flex-grow mt-2 space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">Pick your travel style.</span>
        <div className="space-y-6 mt-6">
          <h2 className="text-xl font-bold">What&apos;s your travel style?</h2>
          <div className="flex flex-wrap gap-2">
            {travelStyles.map((style) => (
              <Toggle
                key={style}
                pressed={selectedStyles.includes(style)}
                onPressedChange={(pressed) => {
                  setSelectedStyles((prev) =>
                    pressed ? [...prev, style] : prev.filter((s) => s !== style)
                  )
                }}
                variant="outline"
                className="data-[state=on]:border-purple-blaze data-[state=on]:text-purple-blaze border-black px-4 text-sm font-normal transition rounded-full"
              >
                {style}
              </Toggle>
            ))}
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <h2 className="text-xl font-bold">Which countries are on your bucket list?</h2>
          <select
            className="w-full border rounded-full px-4 py-2 text-sm mt-3"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Choose between countries</option>
          </select>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Info className="size-4" />
          <span>You can always update this later</span>
        </div>
        <Button
          type="submit"
          className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
        >
          Next
        </Button>
      </form>
      <button
        type="button"
        className="w-full text-sm font-normal mt-2 rounded-4xl"
        onClick={() => router.push(`/info/physical-info?name=${name}`)}
      >
        skip
      </button>
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
