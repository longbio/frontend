import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { sendSignupEmail, verifySignupCode } from './function'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { SignupParams, VerifySignupCodeParams } from './types'

export function useSendOTPEmail(
  options?: Omit<UseMutationOptions<void, Error, SignupParams>, 'onSuccess'>
) {
  const router = useRouter()
  return useMutation<void, Error, SignupParams>({
    mutationFn: (params: SignupParams) => sendSignupEmail(params),
    onSuccess: (_data: void, variables: { email: string }) => {
      const searchParams = new URLSearchParams({ email: variables.email })
      router.push(`/auth/signup/verify?${searchParams.toString()}`)
    },
    ...options,
  })
}

export function useVerifySignupCode() {
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { mutateAsync, isPending } = useMutation<
    { status: number; message: string; data?: { isNewUser?: boolean } },
    Error,
    VerifySignupCodeParams
  >({
    mutationFn: (params: VerifySignupCodeParams) => verifySignupCode(params),
    onSuccess: (data) => {
      if (data.status === 200) {
        if (data.data?.isNewUser === false) {
          setError('This email is already registered.')
          setIsSuccess(false)
        } else {
          setIsSuccess(true)
          setError(null)
        }
      } else {
        setError(data.message || 'Invalid verification code. Please try again.')
        setIsSuccess(false)
      }
    },
    onError: (err) => {
      setError(err.message || 'Verification failed. Please check your code and try again.')
      setIsSuccess(false)
    },
  })

  const handleVerify = async (email: string, code: string) => {
    setError(null)
    setIsSuccess(false)
    if (!code.trim()) {
      setError('Please enter verification code')
      return
    }
    await mutateAsync({ email, code })
  }

  return { handleVerify, error, isPending, isSuccess }
}
