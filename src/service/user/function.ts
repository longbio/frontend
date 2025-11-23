import { http } from '@/http'
import type { UpdateUserParams } from './type'

export async function updateUser(params: UpdateUserParams): Promise<{
  status: number
  message: string
  data?: any
}> {
  try {
    const response = await http.patch<{
      status: number
      message: string
      data?: any
    }>('/v1/users/me', {
      body: params,
      credentials: 'include',
      throwError: true,
    })
    return response
  } catch (error) {
    // Re-throw the error so it can be caught by the hook
    throw error
  }
}
