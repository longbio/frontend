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

export function useVerifySignupCode(
  options?: UseMutationOptions<
    { success?: boolean; message?: string },
    Error,
    VerifySignupCodeParams
  >
) {
  return useMutation<{ success?: boolean; message?: string }, Error, VerifySignupCodeParams>({
    mutationFn: (params: VerifySignupCodeParams) => verifySignupCode(params),
    ...options,
  })
}
