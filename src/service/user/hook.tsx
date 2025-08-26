'use client'
import { useMutation } from '@tanstack/react-query'
import {
  updateUserServerAction,
  uploadProfileImageServerAction,
} from '@/lib/server-action/user-actions'
import type { UpdateUserParams } from './type'

export function useUpdateUser() {
  return useMutation({
    mutationFn: (data: UpdateUserParams) => updateUserServerAction(data),
  })
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: uploadProfileImageServerAction,
  })
}
