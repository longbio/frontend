'use client'
import { useMutation } from '@tanstack/react-query'
import {
  updateUserServerAction,
  uploadProfileImageServerAction,
  getUserByIdServerAction,
  updateEducationServerAction,
  updatePetServerAction,
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

export function useGetUserById() {
  return useMutation({
    mutationFn: (userId: string) => getUserByIdServerAction(userId),
  })
}

export function useUpdateEducation() {
  return useMutation({
    mutationFn: (data: { university: string; topic: string; graduationYear: string }) =>
      updateEducationServerAction(data),
  })
}

export function useUpdatePet() {
  return useMutation({
    mutationFn: (data: { name: string; breed: string }) => updatePetServerAction(data),
  })
}
