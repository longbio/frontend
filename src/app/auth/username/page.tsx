'use client'

import { z } from 'zod'
import Header from '@/components/Header'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useUpdateUser } from '@/service/user/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { FormInput } from '@/app/auth/components/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
})

type FormData = z.infer<typeof usernameSchema>

export default function UsernamePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const { mutateAsync, isPending } = useUpdateUser()

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
  }, [username])

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ username: data.username })
      router.push(`/info/birthday?name=${encodeURIComponent(name)}`)
    } catch (error) {
      console.error('Failed to update username:', error)
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
              error={!!errors.username}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
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
