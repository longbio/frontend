'use client'
import clsx from 'clsx'
import Link from 'next/link'
import Header from '@/components/Header'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useVerifySignupCode } from '@/service/auth/hook'
import { FormInput } from '@/app/auth/components/FormInput'
import { VerificationCodeInput } from '@/app/auth/components/VerificationCodeInput'

function VerifySignUpContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [verificationCode, setVerificationCode] = useState('')
  const { handleVerify, error, isPending, isSuccess } = useVerifySignupCode('signup')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify(email, verificationCode)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col justify-between h-full gap-y-20">
        <div className="text-left text-purple-blaze">
          <Header />
          <h2 className="text-sm font-bold text-black mt-5">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            already have an account?
            <Link href="/auth/signin" className="text-purple-blaze hover:underline mx-0.5">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col justify-between h-full">
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

            <VerificationCodeInput
              email={email}
              value={verificationCode}
              onChange={setVerificationCode}
              isSuccess={isSuccess}
              error={error || ''}
            />
          </div>

          <Button
            className={clsx(
              'sticky -bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl',
              {
                'disabled:bg-silver-mist disabled:cursor-not-allowed': true,
              }
            )}
            type="submit"
            disabled={isPending || !verificationCode.trim()}
          >
            {isPending ? 'Verifying...' : 'Verify'}
          </Button>
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
