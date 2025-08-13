'use client'

import { UpdateUserParams } from './type'
import { useMutation } from '@tanstack/react-query'
import { updateUser, uploadProfileImage } from '@/service/user/function'

export function useUpdateUser() {
  return useMutation({
    mutationFn: (data: UpdateUserParams) => updateUser(data),
  })
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: uploadProfileImage,
  })
}
