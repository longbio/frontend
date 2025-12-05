import { http } from '@/http'
import { verifyAuthCodeServerAction } from '@/lib/server-action/auth-actions'
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
  // Use server action for verify to properly handle cookies in cross-origin scenarios
  // Works for both signin and signup flows
  return await verifyAuthCodeServerAction(params)
}
