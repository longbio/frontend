'use client'

import { z } from 'zod'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useUpdateUser } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { FormInput } from '@/app/auth/components/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense, useState } from 'react'

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
})

type FormData = z.infer<typeof usernameSchema>

function UsernameForm({ name }: { name: string }) {
  const router = useRouter()
  const { mutateAsync, isPending } = useUpdateUser()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: (() => {
      if (typeof window !== 'undefined') {
        const cookie = getCookie('auth_username')
        if (cookie) {
          try {
            return JSON.parse(decodeURIComponent(cookie))
          } catch {}
        }
      }
      return { username: '' }
    })(),
  })

  const username = watch('username')

  useEffect(() => {
    setCookie('auth_username', JSON.stringify({ username }))
    // Clear API error when username changes
    setApiError(null)
  }, [username])

  const onSubmit = async (data: FormData) => {
    try {
      setApiError(null)
      await mutateAsync({ username: data.username })
      const nextUrl =
        name && name.trim()
          ? `/info/birthday?name=${encodeURIComponent(name.trim())}`
          : '/info/birthday'
      router.push(nextUrl)
    } catch (error) {
      console.error('Failed to update username:', error)
      const apiErrorObj = error as Error & { status?: number; data?: { message?: string } }
      const status = apiErrorObj?.status

      if (status === 429) {
        setApiError('This username is already taken. Please choose another one.')
      } else if (status === 400) {
        setApiError(
          apiErrorObj?.data?.message || 'Invalid username format. Please check your input.'
        )
      } else if (status === 401 || status === 403) {
        setApiError('You are not authorized. Please log in again.')
      } else if (status === 422) {
        setApiError(apiErrorObj?.data?.message || 'Invalid data. Please check your input.')
      } else if (status === 500) {
        setApiError('Server error. Please try again later.')
      } else {
        setApiError(
          apiErrorObj?.data?.message ||
            apiErrorObj?.message ||
            'Failed to update username. Please try again.'
        )
      }
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div>
          <Header />
          <h2 className="text-base font-bold text-black mt-5">Choose Your Username</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            This will be your unique identifier on the platform
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <FormInput
              id="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              error={!!errors.username || !!apiError}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            {apiError && !errors.username && (
              <p className="text-red-500 text-sm mt-1">{apiError}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPending || !username || username.length < 3}
            className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function UsernamePageContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''

  return <UsernameForm name={name} />
}

export default function UsernamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full w-full p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      }
    >
      <UsernamePageContent />
    </Suspense>
  )
}
