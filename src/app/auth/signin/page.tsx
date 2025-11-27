'use client'

import { z } from 'zod'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { setCookie, removeAllCookies } from '@/utils/cookie'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSendOTPEmail } from '@/service/auth/hook'
import { FormInput } from '@/app/auth/components/FormInput'

const signInSchema = z.object({
  email: z.string().email(),
})
type FormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const { mutateAsync, isPending } = useSendOTPEmail({ mode: 'signin' })

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  })

  const email = watch('email')

  useEffect(() => {
    // Remove all cookies on page load
    removeAllCookies()
  }, [])

  useEffect(() => {
    setCookie('auth_signin', JSON.stringify({ email }))
  }, [email])

  const onSubmit = async (data: FormData) => {
    await mutateAsync({ email: data.email })
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div>
          <Header />
          <h2 className="text-base font-bold text-black mt-5">Welcome Back!</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            don&apos;t have an account?
            <Link href="/auth/signup" className="text-purple-blaze hover:underline mx-0.5">
              Sign Up
            </Link>
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
          autoComplete="off"
        >
          <div className="space-y-6">
            <FormInput
              id="email"
              type="email"
              label="Email"
              placeholder="Exp: Jessica@gmail.com"
              error={!!errors.email}
              autoComplete="off"
              {...register('email')}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Sending...' : 'Get Verification code'}
          </Button>
        </form>
      </div>
    </div>
  )
}
