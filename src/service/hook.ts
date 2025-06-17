import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, getPosts, createPost } from './function'
import { QUERY_KEYS } from './constant'

export function useUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: () => getUser(id),
  })
}

export function usePosts() {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: getPosts,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] })
    },
  })
}
