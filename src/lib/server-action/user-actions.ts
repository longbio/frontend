'use server'

import { getAuthTokens } from '@/lib/auth-actions'
import type { UpdateUserParams, UploadProfileImageResponse } from '@/service/user/type'

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

  return res.json()
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

  return res.json() as Promise<UploadProfileImageResponse>
}
