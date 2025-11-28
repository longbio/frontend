'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  uploadProfileImageServerAction,
  updateEducationServerAction,
  updatePetServerAction,
  updateJobServerAction,
  getCurrentUserServerAction,
} from '@/lib/server-action/user-actions'
import { getAccessToken } from '@/lib/auth-actions'
import type { UpdateUserParams } from './type'

export function useUpdateUser() {
  return useMutation({
    mutationFn: async (data: UpdateUserParams) => {
      // Get token from server action
      const accessToken = await getAccessToken()

      if (!accessToken) {
        const error = new Error('Unauthorized') as Error & { status?: number }
        error.status = 401
        throw error
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!apiUrl) {
        throw new Error('API base URL is not configured')
      }

      // Make direct request to API from client-side
      const response = await fetch(`${apiUrl}/v1/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const statusCode = response.status
        let errorData: { message?: string; [key: string]: any } = {}
        try {
          const text = await response.text()
          errorData = text
            ? JSON.parse(text)
            : { message: `Request failed with status ${statusCode}` }
        } catch {
          errorData = { message: `Request failed with status ${statusCode}` }
        }
        const error = new Error(errorData?.message || 'Failed to update user') as Error & {
          status: number
          message: string
          data?: { message?: string; [key: string]: any }
        }
        error.status = statusCode
        error.message = errorData?.message || error.message
        error.data = errorData
        throw error
      }

      return await response.json()
    },
  })
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: uploadProfileImageServerAction,
  })
}

export function useUpdateEducation() {
  return useMutation({
    mutationFn: (data: { university: string | null; topic: string | null; graduationYear: string | null }) =>
      updateEducationServerAction(data),
  })
}

export function useUpdatePet() {
  return useMutation({
    mutationFn: (data: { name: string; breed: string }) => updatePetServerAction(data),
  })
}

export function useUpdateJob() {
  return useMutation({
    mutationFn: (data: { position: string; company: string }) => updateJobServerAction(data),
  })
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserServerAction,
  })
}
