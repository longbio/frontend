'use server'

import { getAuthTokens } from '@/lib/auth-actions'
import type { UpdateUserParams } from './type'

export async function updateUser(params: UpdateUserParams): Promise<{
  status: number
  message: string
  data?: any
}> {
  try {
    const { accessToken } = await getAuthTokens()

    if (!accessToken) {
      const error = new Error('Unauthorized') as Error & { status?: number }
      error.status = 401
      throw error
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiUrl) {
      throw new Error('API base URL is not configured')
    }

    const response = await fetch(`${apiUrl}/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const statusCode = response.status
      let data: { message?: string; [key: string]: any } = {}
      try {
        const text = await response.text()
        data = text ? JSON.parse(text) : { message: `Request failed with status ${statusCode}` }
      } catch {
        // If response body is not JSON, create a default error structure
        data = { message: `Request failed with status ${statusCode}` }
      }
      const error = new Error(data?.message || 'Failed to update user') as Error & {
        status: number
        message: string
        data?: { message?: string; [key: string]: any }
      }
      error.status = statusCode
      error.message = data?.message || error.message
      error.data = data
      throw error
    }

    const json = await response.json()
    return json
  } catch (error) {
    // Re-throw the error so it can be caught by the hook
    throw error
  }
}
