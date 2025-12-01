'use client'

import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useVerifySignupCode } from '@/service/auth/hook'
import { FormInput } from '@/app/auth/components/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { VerificationCodeInput } from '@/app/auth/components/VerificationCodeInput'
import { getCurrentUserServerAction } from '@/lib/server-action/user-actions'
import { populateCookiesFromBio } from '@/utils/populateCookiesFromBio'

const schema = z.object({
  verificationCode: z.string().min(5, 'Verification code must be 5 digits'),
})

type FormData = z.infer<typeof schema>

function VerifySignInContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || undefined
  const phoneNumber = searchParams.get('phoneNumber') || undefined
  const { handleVerify, error, isPending, isSuccess, isNewUser } = useVerifySignupCode('signin')

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { verificationCode: '' },
  })

  const onSubmit = (data: FormData) => {
    handleVerify(email, phoneNumber, data.verificationCode)
  }

  useEffect(() => {
    const fetchAndCacheBioData = async () => {
      if (isSuccess && isNewUser === false) {
        try {
          // Fetch bio data from API
          const bioData = await getCurrentUserServerAction()
          
          // Populate React Query cache
          queryClient.setQueryData(['currentUser'], bioData)
          
          // Populate cookies with bio data for edit forms
          if (bioData?.data) {
            populateCookiesFromBio(bioData.data)
          }
          
          // Redirect to bio page
          router.push('/bio')
        } catch (error) {
          console.error('Failed to fetch bio data:', error)
          // Still redirect even if fetch fails - the bio page will handle the error
          router.push('/bio')
        }
      }
    }

    fetchAndCacheBioData()
  }, [isSuccess, isNewUser, router, queryClient])

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col justify-between h-full gap-y-20">
        <div>
          <Header />
          <h2 className="text-base font-bold text-black mt-5">Welcome Back!</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            don’t have an account?
            <Link href="/auth/signup" className="text-purple-blaze hover:underline mx-0.5">
              Sign Up
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            {email ? (
              <FormInput
                id="email"
                type="email"
                label="Email"
                value={email}
                disabled
                labelClassName="text-light-gray"
                className="text-light-gray disabled:border-light-gray"
              />
            ) : (
              <FormInput
                id="phoneNumber"
                type="tel"
                label="WhatsApp Phone Number"
                value={phoneNumber || ''}
                disabled
                labelClassName="text-light-gray"
                className="text-light-gray disabled:border-light-gray"
              />
            )}
            <div className="relative">
              <VerificationCodeInput
                email={email}
                phoneNumber={phoneNumber}
                value={watch('verificationCode')}
                onChange={(val) => setValue('verificationCode', val)}
                isSuccess={isSuccess && isNewUser === false}
                error={error || errors.verificationCode?.message || ''}
              />
              {error && (
                <p
                  className="absolute text-red-600 text-xs mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 text-center mt-2">
            <Button
              className={clsx(
                'w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl',
                'disabled:bg-silver-mist disabled:cursor-not-allowed'
              )}
              type="submit"
              disabled={isPending || !watch('verificationCode').trim()}
            >
              {isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VerifySignIn() {
  return (
    <Suspense>
      <VerifySignInContent />
    </Suspense>
  )
}
