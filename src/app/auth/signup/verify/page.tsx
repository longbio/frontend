'use client'
import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import { Suspense, useEffect } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVerifySignupCode } from '@/service/auth/hook'
import { FormInput } from '@/app/auth/components/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { VerificationCodeInput } from '@/app/auth/components/VerificationCodeInput'

const schema = z.object({
  verificationCode: z.string().min(5, 'Verification code must be 5 digits'),
})

type FormData = z.infer<typeof schema>

function VerifySignUpContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''
  const { handleVerify, error, isPending, isSuccess } = useVerifySignupCode()
  const router = useRouter()
  const backPageButton = () => {
    router.back()
  }
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      verificationCode: '',
    },
  })

  const onSubmit = (data: FormData) => {
    handleVerify(email, data.verificationCode)
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/info/birthday?name=${encodeURIComponent(name)}`)
    }
  }, [isSuccess, router, name])

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col justify-between h-full gap-y-20">
        <div className="text-left text-purple-blaze">
          <Header />
          <h2 className="text-base font-bold text-black mt-5">Let&apos;s Start!</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            Already have an account?
            <Link href="/auth/signin" className="text-purple-blaze hover:underline mx-0.5">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <FormInput
              id="email"
              type="email"
              label="Email"
              value={email}
              disabled
              labelClassName="text-light-gray"
              className="text-light-gray disabled:border-light-gray"
            />
            <div>
              <VerificationCodeInput
                email={email}
                value={watch('verificationCode')}
                onChange={(val) => setValue('verificationCode', val)}
                isSuccess={isSuccess}
                error={errors.verificationCode?.message || error || ''}
              />
              {error && (
                <h2
                  className="absolute text-red-600 text-xs mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </h2>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 text-center mt-2">
            <Button
              className={clsx('w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl', {
                'disabled:bg-silver-mist disabled:cursor-not-allowed': true,
              })}
              type="submit"
              disabled={isPending || !watch('verificationCode').trim()}
            >
              {isPending ? 'Verifying...' : 'Verify'}
            </Button>
            <button
              type="button"
              onClick={backPageButton}
              className="w-full text-sm text-black hover:text-purple-blaze py-3.5"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VerifySignUp() {
  return (
    <Suspense>
      <VerifySignUpContent />
    </Suspense>
  )
}
