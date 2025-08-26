'use server'

import { getAuthTokens } from '@/lib/auth-actions'
import type { UpdateUserParams, UploadProfileImageResponse } from '@/service/user/type'

export async function updateUserServerAction(params: UpdateUserParams) {
  console.log('updateUserServerAction called with params:', params)

  const { accessToken } = await getAuthTokens()
  console.log('Access token from cookies:', accessToken)

  if (!accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  })

  console.log('PATCH /v1/users/me status:', res.status)

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.log('PATCH /v1/users/me error response:', data)
    throw new Error(data?.message || 'Failed to update user')
  }

  const json = await res.json()
  console.log('PATCH /v1/users/me response JSON:', json)
  return json
}

export async function uploadProfileImageServerAction(file: File) {
  console.log('uploadProfileImageServerAction called with file:', file.name)

  const { accessToken } = await getAuthTokens()
  console.log('Access token from cookies:', accessToken)

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
    console.log('POST /v1/users/me/profile-image error response:', data)
    throw new Error(data?.message || 'Failed to upload profile image')
  }

  const json = (await res.json()) as UploadProfileImageResponse
  console.log('POST /v1/users/me/profile-image response JSON:', json)
  return json
}
