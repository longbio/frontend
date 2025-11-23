'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  uploadProfileImageServerAction,
  updateEducationServerAction,
  updatePetServerAction,
  updateJobServerAction,
  getCurrentUserServerAction,
} from '@/lib/server-action/user-actions'
import { updateUser } from './function'
import type { UpdateUserParams } from './type'

export function useUpdateUser() {
  return useMutation({
    mutationFn: (data: UpdateUserParams) => updateUser(data),
  })
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: uploadProfileImageServerAction,
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
