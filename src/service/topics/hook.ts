import { useQuery } from '@tanstack/react-query'
import { fetchTopics, fetchUniversitiesByTopic, fetchAllUniversities } from './function'
import type { Topic, University } from './types'

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
  const { data, isLoading, error, isError } = useQuery<University[], Error>({
    queryKey: ['universities-by-topic', topicId],
    queryFn: () => topicId ? fetchUniversitiesByTopic(topicId) : Promise.resolve([]),
    enabled: !!topicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  return {
    universities: data || [],
    isLoading,
    error,
    isError,
  }
}

export function useAllUniversities() {
  const { data, isLoading, error, isError } = useQuery<University[], Error>({
    queryKey: ['all-universities'],
    queryFn: fetchAllUniversities,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  })

  return {
    universities: data || [],
    isLoading,
    error,
    isError,
  }
}
