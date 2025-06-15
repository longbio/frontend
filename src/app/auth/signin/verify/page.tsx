'use client'
import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useForm } from 'react-hook-form'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlarmClock, RotateCcw } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, Suspense } from 'react'
import { FormInput } from '@/app/auth/components/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'

const verifySchema = z.object({
  verificationCode: z.string().min(1).length(6),
})

type VerifyFormData = z.infer<typeof verifySchema>

function VerifySignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [timeLeft, setTimeLeft] = useState(94)
  const [isTimeUp, setIsTimeUp] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    mode: 'onChange',
  })

  const verificationCode = watch('verificationCode')
  const isVerified = verificationCode === '123456'

  const resetTimer = () => {
    setTimeLeft(94)
    setIsTimeUp(false)
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setIsTimeUp(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const onSubmit = () => {
    if (isVerified) {
      router.push('/auth/signin/success')
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">
      <div className="w-full max-w-md space-y-8 mt-2">
        <div className="text-left text-purple-blaze">
          <Logo />
          <h2 className="text-sm font-bold text-black mt-12">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-[10px] font-normal">
            don&apos;t have an account?
            <Link href="/auth/login" className="hover:underline px-1">
              Sign Up
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
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
              <FormInput
                id="password"
                type="password"
                label="Password"
                placeholder="Exp: 1234567889@@"
                disabled
                labelClassName="text-light-gray"
                className="text-light-gray disabled:border-light-gray"
              />
              <span className="text-[10px] font-normal text-light-gray mt-2 block">
                Login with verification code
              </span>
            </div>
            <div className="relative">
              <FormInput
                id="verificationCode"
                type="text"
                label="Verification Code"
                placeholder="Please check your inbox"
                {...register('verificationCode')}
                className={clsx({
                  'border-red-500 focus-visible:ring-red-500/50': isTimeUp && !isVerified,
                  'border-green-500 focus-visible:ring-green-500/50': isVerified,
                })}
              />
              {!isVerified ? (
                <button
                  type="button"
                  className={clsx('absolute right-8 top-6/9 text-sm flex items-center gap-1', {
                    'text-red-500': isTimeUp,
                    'text-light-gray': !isTimeUp,
                  })}
                  onClick={resetTimer}
                  disabled={!isTimeUp}
                >
                  {isTimeUp ? (
                    <>
                      <h1 className="text-sm font-light">Recent</h1>
                      <RotateCcw className="size-4" />
                    </>
                  ) : (
                    <>
                      {formatTime(timeLeft)}
                      <AlarmClock className="size-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="absolute right-8 top-6/9 text-green-500">
                  <CheckCircle2 className="size-5" />
                </div>
              )}
              {isTimeUp && !isVerified && (
                <h2 className="absolute text-red-500 text-xs mt-1">
                  Please enter Verification code we sent to your email address
                </h2>
              )}
            </div>
          </div>

          <Button
            className={clsx('w-full bg-purple-blaze text-sm font-bold mt-40 rounded-4xl', {
              'disabled:bg-silver-mist disabled:cursor-not-allowed': true,
            })}
            type="submit"
            disabled={!isValid}
          >
            Verify
          </Button>
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
