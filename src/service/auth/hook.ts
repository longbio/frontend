import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { clearAllCookies } from '@/utils/cookie'
import { verifySignupCode, sendSignupEmail } from './function'
import type { VerifySignupCodeParams, SignupParams } from './types'

export function useSendOTPEmail(options?: { mode?: 'signup' | 'signin' }) {
  const router = useRouter()

  return useMutation<void, Error, SignupParams>({
    mutationFn: (params) => sendSignupEmail(params),
    onSuccess: (_data, variables) => {
      const searchParams = new URLSearchParams({ email: variables.email })
      if (options?.mode === 'signin') {
        router.push(`/auth/signin/verify?${searchParams.toString()}`)
      } else {
        router.push(`/auth/signup/verify?${searchParams.toString()}`)
      }
    },
  })
}

export function useVerifySignupCode(mode: 'signup' | 'signin' = 'signup') {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null)

  const { mutateAsync, isPending } = useMutation<
    { status: number; message: string; data?: { isNewUser?: boolean } },
    Error,
    VerifySignupCodeParams
  >({
    mutationFn: (params) => verifySignupCode(params),
    onSuccess: (data) => {
      if (data.status === 200) {
        const newUser = data.data?.isNewUser ?? null
        setIsNewUser(newUser)

        if (mode === 'signin') {
          if (newUser === false) {
            setIsSuccess(true)
            setError(null)
            // Clear all cookies and React Query cache after successful signin
            clearAllCookies()
            queryClient.clear()
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
            router.refresh()
          } else if (newUser === true) {
            setIsSuccess(false)
            setError('Email not registered. Please sign up first.')
          }
        } else {
          if (newUser === true) {
            setIsSuccess(true)
            setError(null)
            // Clear all cookies and React Query cache after successful signup
            clearAllCookies()
            queryClient.clear()
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
            router.refresh()
          } else if (newUser === false) {
            setIsSuccess(false)
            setError('This email is already registered.')
          }
        }
      } else {
        setIsSuccess(false)
        setError(data.message || 'Invalid verification code. Please try again.')
      }
    },
    onError: (err) => {
      setIsSuccess(false)
      setError(err.message || 'Verification failed. Please check your code and try again.')
      setIsNewUser(null)
    },
  })

  const handleVerify = async (email: string, code: string) => {
    setError(null)
    setIsSuccess(false)
    setIsNewUser(null)

    if (!code.trim()) {
      setError('Please enter verification code')
      return null
    }

    return await mutateAsync({ email, code })
  }

  return { handleVerify, error, isPending, isSuccess, isNewUser }
}
