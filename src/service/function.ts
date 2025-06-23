import { http } from '@/http'
import type { SignupParams, VerifySignupCodeParams } from './types'

export async function sendSignupEmail(params: SignupParams) {
  const response = await http.post<void>('/v1/auth/verification-code/send', {
    body: JSON.stringify(params),
  })
  return response
}

export async function verifySignupCode(params: VerifySignupCodeParams) {
  const response = await http.post<{ success?: boolean; message?: string }>(
    '/v1/auth/verification-code/verify',
    {
      body: JSON.stringify(params),
    }
  )
  return response
}
