'use server'

import { getAuthTokens } from '@/lib/auth-actions'
import type {
  UpdateUserParams,
  UploadProfileImageResponse,
  GetUserByIdResponse,
} from '@/service/user/type'

export async function updateUserServerAction(params: UpdateUserParams) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message || 'Failed to update user')
  }

  const json = await res.json()
  console.log('PATCH /v1/users/me response JSON:', json)
  return json
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

  console.log('POST /v1/users/me/profile-image status:', res.status)

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message || 'Failed to upload profile image')
  }

  const json = (await res.json()) as UploadProfileImageResponse
  return json
}

export async function getUserByIdServerAction(userId: string): Promise<GetUserByIdResponse> {
  const res = await fetch(`https://api.longbio.me/v1/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message || 'Failed to get user data')
  }

  const json = await res.json()
  return json
}

export async function updateEducationServerAction(data: {
  university: string
  topic: string
  graduationYear: string
}) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/education`, {
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/pet`, {
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

export async function updateJobServerAction(data: { position: string; company: string }) {
  const { accessToken } = await getAuthTokens()

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/job`, {
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
