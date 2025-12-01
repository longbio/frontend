import { http } from '@/http'
import type { SignupParams, VerifySignupCodeParams } from './types'

export async function sendSignupEmail(params: SignupParams) {
  const response = await http.post<void>('/v1/auth/verification-code/send', {
    body: params,
  })
  return response
}

export async function sendSignupPhone(params: SignupParams) {
  const response = await http.post<void>('/v1/auth/verification-code/send', {
    body: params,
  })
  return response
}

export async function verifySignupCode(params: VerifySignupCodeParams): Promise<{
  status: number
  message: string
  data?: { isNewUser?: boolean }
}> {
  const response = await http.post<{
    status: number
    message: string
    data?: { isNewUser?: boolean }
  }>('/v1/auth/verification-code/verify', {
    body: params,
    credentials: 'include',
  })
  return response
}
