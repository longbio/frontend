'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlarmClock, RotateCcw, CheckCircle2 } from 'lucide-react'

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [timeLeft, setTimeLeft] = useState(94)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerified, setIsVerified] = useState(false)

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

  // Auto verify when correct code is entered
  useEffect(() => {
    if (verificationCode === '123456') {
      // Mock verification code
      setIsVerified(true)
    } else {
      setIsVerified(false)
    }
  }, [verificationCode])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (isVerified) {
      router.push('/step1')
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">
      <div className="w-full max-w-md space-y-8 mt-20">
        <div className="text-left text-purple-blaze">
          <h2 className="text-sm font-bold text-black">Let&apos;s Start with ...</h2>
          <h3 className="mt-2 text-[10px] font-normal">
            already have an account?
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={handleVerify} className="mt-40">
          <div className="space-y-6">
            <label aria-disabled htmlFor="email" className="text-xl font-bold text-light-gray">
              Email
            </label>
            <Input
              disabled
              type="email"
              value={email}
              className="w-full text-light-gray mt-6 disabled:border-light-gray"
            />
            <label htmlFor="text" className="text-xl font-bold">
              Verification Code
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Please check your inbox"
                className={clsx('w-full mt-6', {
                  'border-red-500 focus:border-red-500 focus-visible:ring-0':
                    isTimeUp && !isVerified,
                  'border-green-500 focus:border-green-500 focus-visible:ring-0': isVerified,
                })}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {!isVerified ? (
                <button
                  className={clsx(
                    'absolute right-8 top-1/2 -translate-y-1/2 text-sm flex items-center gap-1',
                    {
                      'text-red-500': isTimeUp,
                      'text-light-gray': !isTimeUp,
                    }
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    if (isTimeUp) {
                      resetTimer()
                    }
                  }}
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
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500">
                  <CheckCircle2 className="size-5" />
                </div>
              )}
              {isTimeUp && !isVerified && (
                <p className="absolute text-red-500 text-xs mt-1">
                  Please enter Verification code we sent to your email adress
                </p>
              )}
            </div>
          </div>

          <Button
            className={clsx('w-full bg-purple-blaze text-sm font-bold mt-56 rounded-4xl', {
              'disabled:bg-silver-mist disabled:cursor-not-allowed': true,
            })}
            type="submit"
            disabled={!verificationCode.trim()}
          >
            Verify
          </Button>
        </form>
      </div>
    </div>
  )
}
