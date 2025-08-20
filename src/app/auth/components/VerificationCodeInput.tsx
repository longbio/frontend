'use client'
import clsx from 'clsx'
import { FormInput } from './FormInput'
import { useState, useEffect } from 'react'
import { sendSignupEmail } from '@/service/auth/function'
import { CheckCircle2, AlarmClock, RotateCcw } from 'lucide-react'

interface VerificationCodeInputProps {
  email: string
  value: string
  onChange: (value: string) => void
  isSuccess?: boolean
  error?: string
}

export function VerificationCodeInput({
  email,
  value,
  onChange,
  isSuccess = false,
  error,
}: VerificationCodeInputProps) {
  const [timeLeft, setTimeLeft] = useState(94)
  const [isTimeUp, setIsTimeUp] = useState(false)

  const resetTimer = async () => {
    setTimeLeft(94)
    setIsTimeUp(false)
    await sendSignupEmail({ email })
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

  // Show timeout error when timer expires and no code is entered
  const showTimeoutError = isTimeUp && !value && !isSuccess && !error

  return (
    <div className="relative">
      <FormInput
        id="verificationCode"
        type="text"
        label="Verification Code"
        placeholder="Please check your inbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx({
          'border-red-500 focus-visible:ring-red-500/50': error || showTimeoutError,
          'border-green-500 focus-visible:ring-green-500/50': isSuccess,
        })}
      />
      {isSuccess && <CheckCircle2 className="absolute right-8 top-6/9 text-green-500 size-5" />}
      {!value && (
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
      )}
      {showTimeoutError && (
        <h2 className="absolute text-red-500 text-xs mt-1">
          Please enter Verification code we sent to your email address
        </h2>
      )}
    </div>
  )
}
