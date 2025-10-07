'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  updateUserServerAction,
  uploadProfileImageServerAction,
  updateEducationServerAction,
  updatePetServerAction,
  updateJobServerAction,
  getEducationServerAction,
  getPetServerAction,
  getJobServerAction,
  getCurrentUserServerAction,
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

export function useGetEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: getEducationServerAction,
  })
}

export function useGetPet() {
  return useQuery({
    queryKey: ['pet'],
    queryFn: getPetServerAction,
  })
}

export function useGetJob() {
  return useQuery({
    queryKey: ['job'],
    queryFn: getJobServerAction,
  })
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserServerAction,
  })
}
