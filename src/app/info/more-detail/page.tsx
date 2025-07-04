'use client'
import { z } from 'zod'
import { Suspense } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

const moreDetailSchema = z.object({
  detail: z.string().min(1, 'Required'),
})
type MoreDetailFormType = z.infer<typeof moreDetailSchema>

function MoreDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MoreDetailFormType>({
    resolver: zodResolver(moreDetailSchema),
    mode: 'onChange',
  })

  const onSubmit = () => {
    router.push(`/info/congrats?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={100} />
      <Header className="mt-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow justify-start items-center mt-2 space-y-4"
      >
        <h1 className="text-2xl font-bold text-left w-full">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal text-left w-full">Let&apos;s take the Last step.</span>
        <span className="text-xl font-bold mt-8 w-full">
          Do you want to add something to this list?
        </span>
        <textarea
          {...register('detail')}
          placeholder="Exp: Isfahan"
          className={`w-full h-28 border ${
            errors.detail ? 'border-red-500' : 'border-black'
          } rounded-2xl p-4 text-sm mt-2 resize-none focus:outline-none focus:border-purple-blaze`}
        />
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
        onClick={() => router.push(`/info/congrats?name=${name}`)}
      >
        skip
      </button>
    </div>
  )
}
export default function MoreDetail() {
  return (
    <Suspense>
      <MoreDetailContent />
    </Suspense>
  )
}
