import { http } from '@/http'
import type { User, Post } from './types'

export const getUser = (id: string) => http.get<User>(`/users/${id}`)

export const getPosts = () => http.get<Post[]>('/posts')

export const createPost = (data: Omit<Post, 'id'>) =>
  http.post<Post>('/posts', { body: JSON.stringify(data) })
