'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useVerifySignupCode } from '@/service/hook'
import { FormInput } from '@/app/auth/components/FormInput'
import { useSearchParams, useRouter } from 'next/navigation'
import { VerificationCodeInput } from '@/app/auth/components/VerificationCodeInput'

function VerifySignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''
  const [isSuccess, setIsSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

  const { mutateAsync, isPending } = useVerifySignupCode({
    onSuccess: (data) => {
      if (data && data.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push(`/info/birthday?name=${name}`)
        }, 500)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    },
    onError: () => {
      setError('Verification failed. Please check your code and try again.')
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode.trim()) {
      setError('Please enter verification code')
      return
    }
    setError('')
    try {
      await mutateAsync({
        email,
        code: verificationCode,
      })
    } catch {
      // Error is handled by the hook's onError callback
    }
  }

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div className="w-full max-w-md space-y-16">
        <div className="text-left text-purple-blaze">
          <Logo />
          <h2 className="text-sm font-bold text-black mt-8">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-[10px] font-normal">
            already have an account?
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={onSubmit} className="mt-32">
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
              error={error}
            />
          </div>

          <Button
            className="w-full bg-purple-blaze text-sm font-bold mt-32 rounded-4xl disabled:bg-silver-mist disabled:cursor-not-allowed"
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
