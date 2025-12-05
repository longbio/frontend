'use client'
import clsx from 'clsx'
import { FormInput } from './FormInput'
import { useState, useEffect } from 'react'
import { sendSignupEmail, sendSignupPhone } from '@/service/auth/function'
import { CheckCircle2, AlarmClock, RotateCcw } from 'lucide-react'

interface VerificationCodeInputProps {
  email?: string
  phoneNumber?: string
  value: string
  onChange: (value: string) => void
  isSuccess?: boolean
  error?: string
}

export function VerificationCodeInput({
  email,
  phoneNumber,
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
    if (phoneNumber) {
      // Remove "+" sign from phoneNumber before sending
      const phoneNumberWithoutPlus = phoneNumber.replace(/^\+/, '')
      await sendSignupPhone({ phoneNumber: phoneNumberWithoutPlus })
    } else if (email) {
      await sendSignupEmail({ email })
    }
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
      <div className="relative">
        <label htmlFor="verificationCode" className="text-lg font-semibold text-black block mb-3">
          Verification Code
        </label>
        <div className="relative">
          <input
            id="verificationCode"
            type="text"
            placeholder={phoneNumber ? "Please check your WhatsApp" : "Please check your inbox"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
              'file:text-foreground placeholder:text-light-gray placeholder:font-light placeholder:text-[13px] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-black flex h-9 w-full min-w-0 rounded-[100px] border bg-transparent px-8 py-5.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              {
                'border-red-500 focus-visible:ring-red-500/50': error || showTimeoutError,
                'border-green-500 focus-visible:ring-green-500/50': isSuccess,
                'border-black': !error && !showTimeoutError && !isSuccess,
                'pr-24': !value || isSuccess,
              }
            )}
          />
          {isSuccess && <CheckCircle2 className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500 size-5 pointer-events-none" />}
          {!value && (
            <button
              type="button"
              className={clsx('absolute right-8 top-1/2 -translate-y-1/2 text-sm flex items-center gap-1', {
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
        </div>
      </div>
      {showTimeoutError && (
        <h2 className="absolute text-red-500 text-xs mt-1 top-full">
          Please enter Verification code we sent to {phoneNumber ? 'your WhatsApp' : 'your email address'}
        </h2>
      )}
    </div>
  )
}
