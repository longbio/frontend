'use client'
import { z } from 'zod'
import { Suspense, useState } from 'react'
import { Info } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '@/app/info/components/SelectableOption'
import AddMoreBox from '@/app/info/components/AddMoreBox'

const educationSchema = z.object({
  education: z.string({
    required_error: 'Please select your education status',
  }),
})
type EducationFormData = z.infer<typeof educationSchema>

function EducationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { handleSubmit, setValue, watch } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
  })
  const selectedEducation = watch('education')
  const [customOptions, setCustomOptions] = useState<string[]>([])

  const onSubmit = () => {
    router.push(`/info/set-profile?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={28.56} />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-2 space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">Pick your education status.</span>
        <div className="space-y-6 mt-10">
          <h2 className="text-xl font-bold">Which is your educational status?</h2>
          <div className="space-y-2.5">
            <SelectableOption
              id="student"
              label="Student"
              checked={selectedEducation === 'student'}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('education', 'student')
                }
              }}
            />
            <SelectableOption
              id="graduated"
              label="Graduated"
              checked={selectedEducation === 'graduated'}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('education', 'graduated')
                }
              }}
            />
            <AddMoreBox options={customOptions} setOptions={setCustomOptions} />
            <SelectableOption
              id="not-interested"
              label="Not interested in education"
              checked={selectedEducation === 'not-interested'}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('education', 'not-interested')
                }
              }}
            />
            <div className="flex items-center gap-1 text-xs mt-4">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
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
        onClick={() => router.push(`/info/set-profile?name=${name}`)}
      >
        skip
      </button>
    </div>
  )
}
export default function Education() {
  return (
    <Suspense>
      <EducationContent />
    </Suspense>
  )
}
