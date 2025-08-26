import { http } from '@/http'
import { UpdateUserParams, UploadProfileImageResponse } from './type'

export async function updateUser(params: UpdateUserParams) {
  return http.patch('/v1/users/me', { body: params, auth: true, throwError: true })
}
export async function uploadProfileImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  return http.post<UploadProfileImageResponse>('/v1/users/me/profile-image', {
    body: formData,
    throwError: true,
  })
}
