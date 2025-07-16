import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutateAsync, isPending } = useMutation<
    { success?: boolean; message?: string },
    Error,
    VerifySignupCodeParams
  >({
    mutationFn: (params: VerifySignupCodeParams) => verifySignupCode(params),
    onSuccess: (data) => {
      if (data && data.success) {
        setIsSuccess(true)
        setError(null)
        const name = searchParams.get('name') || ''
        router.push(`/info/birthday?name=${name}`)
      } else {
        setError(data?.message || 'Invalid verification code. Please try again.')
      }
    },
    onError: (err) => {
      setError(err.message || 'Verification failed. Please check your code and try again.')
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
