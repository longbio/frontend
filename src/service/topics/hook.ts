import { useQuery } from '@tanstack/react-query'
import { fetchTopics, fetchUniversitiesByTopic } from './function'
import type { Topic } from './types'

export function useTopics() {
  const { data, isLoading, error, isError } = useQuery<Topic[], Error>({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  })

  return {
    topics: data || [],
    isLoading,
    error,
    isError,
  }
}

export function useUniversitiesByTopic(topicId: string | null) {
  const { data, isLoading, error, isError } = useQuery<Topic | null, Error>({
    queryKey: ['universities-by-topic', topicId],
    queryFn: () => topicId ? fetchUniversitiesByTopic(topicId) : Promise.resolve(null),
    enabled: !!topicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  return {
    topic: data,
    universities: data?.universities || [],
    isLoading,
    error,
    isError,
  }
}
