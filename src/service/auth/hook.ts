import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { sendSignupEmail, verifySignupCode } from './function'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { SignupParams, VerifySignupCodeParams } from './types'

type AuthMode = 'signup' | 'signin'

export function useSendOTPEmail(
  mode: AuthMode = 'signup',
  options?: Omit<UseMutationOptions<void, Error, SignupParams>, 'onSuccess'>
) {
  const router = useRouter()
  return useMutation<void, Error, SignupParams>({
    mutationFn: (params: SignupParams) => sendSignupEmail(params),
    onSuccess: (_data: void, variables: { email: string }) => {
      const searchParams = new URLSearchParams({ email: variables.email })
      const verifyPath = mode === 'signup' ? '/auth/signup/verify' : '/auth/signin/verify'
      router.push(`${verifyPath}?${searchParams.toString()}`)
    },
    ...options,
  })
}

export function useVerifySignupCode(
  mode: AuthMode = 'signup',
  options?: UseMutationOptions<
    { success?: boolean; message?: string },
    Error,
    VerifySignupCodeParams
  >
) {
  const router = useRouter()
  const searchParams = useSearchParams()
  return useMutation<{ success?: boolean; message?: string }, Error, VerifySignupCodeParams>({
    mutationFn: (params: VerifySignupCodeParams) => verifySignupCode(params),
    onSuccess: (data) => {
      if (data && data.success) {
        if (mode === 'signup') {
          // For signup, redirect to birthday page
          const name = searchParams.get('name') || ''
          router.push(`/info/birthday?name=${name}`)
        } else {
          // For signin, redirect to success page
          router.push('/auth/signin/success')
        }
      }
    },
    ...options,
  })
}
