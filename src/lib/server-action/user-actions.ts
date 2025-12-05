'use server'

import { getAuthTokens } from '@/lib/auth-actions'
import type {
  UpdateUserParams,
  UploadProfileImageResponse,
  GetUserByIdResponse,
} from '@/service/user/type'

export async function updateUserServerAction(params: UpdateUserParams) {
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

    const res = await fetch(`${apiUrl}/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      const statusCode = res.status
      let data: { message?: string; [key: string]: any } = {}
      try {
        const text = await res.text()
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

    const json = await res.json()
    return json
  } catch (error) {
    // Re-throw if it's already an error with status
    if (error instanceof Error && 'status' in error && typeof (error as any).status === 'number') {
      throw error
    }
    // Wrap unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    const wrappedError = new Error(errorMessage) as Error & {
      status: number
      message: string
      data?: { message?: string; [key: string]: any }
    }
    wrappedError.status = 500
    wrappedError.message = errorMessage
    wrappedError.data = { message: errorMessage }
    throw wrappedError
  }
}

export async function uploadProfileImageServerAction(file: File) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me/profile-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message || 'Failed to upload profile image')
  }

  const json = (await res.json()) as UploadProfileImageResponse
  return json
}

export async function updateEducationServerAction(data: {
  university: string | null
  topic: string | null
  graduationYear: string | null
}) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/educations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to update education')
  }

  const json = await res.json()
  return json
}

export async function updatePetServerAction(data: { name: string; breed: string }) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to update pet')
  }

  const json = await res.json()
  return json
}

export async function updateJobServerAction(data: { 
  position: string | null
  company: string | null
  tags?: string[] | null
}) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to update job')
  }

  const json = await res.json()
  return json
}

export async function getCurrentUserServerAction(): Promise<GetUserByIdResponse> {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to get current user data')
  }

  const json = await res.json()
  return json
}

export async function submitWaitlistServerAction(data: { email: string; phone: string }) {
  // Use server-side only environment variable (no NEXT_PUBLIC prefix)
  // This ensures the API key is never exposed to the client
  const apiToken = process.env.NOCODB_API_TOKEN

  if (!apiToken) {
    throw new Error('NocoDB API token is not configured')
  }

  const res = await fetch('https://app.nocodb.com/api/v2/tables/mejy46r55cnn32u/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xc-token': apiToken,
    },
    body: JSON.stringify({
      email: data.email,
      phone: data.phone,
    }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to submit waitlist')
  }

  const json = await res.json()
  return json
}
