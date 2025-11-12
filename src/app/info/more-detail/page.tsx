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

const moreDetailSchema = z.object({
  detail: z.string().min(1, 'Required'),
})
type MoreDetailFormType = z.infer<typeof moreDetailSchema>

function MoreDetailContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const isEditMode = searchParams.get('edit') === 'true'
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MoreDetailFormType>({
    resolver: zodResolver(moreDetailSchema),
    mode: 'onChange',
    defaultValues: {},
  })
  const detail = watch('detail')

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_more_detail')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.detail) {
          setValue('detail', data.detail)
        }
      } catch {}
    }
  }, [setValue])

  useEffect(() => {
    setCookie('info_more_detail', JSON.stringify({ detail }))
  }, [detail])

  const onSubmit = async () => {
    try {
      await mutation.mutateAsync({
        details: detail || '',
      })

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/congrats?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to update more details', err)
      // Don't navigate on error
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={100} className="shrink-0" />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s take the Last step.
            </span>
          </div>
          <div className="flex flex-col gap-y-4 mt-10">
            <h2 className="text-xl font-bold mt-8 w-full">
              Do you want to add something to this list?
            </h2>
            <textarea
              {...register('detail')}
              className={`w-full h-28 border ${
                errors.detail ? 'border-red-500' : 'border-black'
              } rounded-2xl p-4 text-sm mt-2 resize-none focus:outline-none focus:border-purple-blaze`}
            />
          </div>
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/congrats?name=${name}`)
            }
          }}
          loading={mutation.isPending}
        />
      </form>
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
