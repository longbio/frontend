import { UpdateUserParams } from './type'

export async function updateUser(params: UpdateUserParams) {
  return fetch('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(params),
    credentials: 'include',
  }).then((res) => res.json())
}

export async function uploadProfileImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  return fetch('/api/users/me/profile-image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then((res) => res.json())
}
