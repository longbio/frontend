import { useQuery } from '@tanstack/react-query'
import { fetchUniversities } from './function'
import type { University } from './types'

export function useUniversities() {
  const { data, isLoading, error, isError } = useQuery<University[], Error>({
    queryKey: ['universities'],
    queryFn: fetchUniversities,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const names = Array.isArray(data) ? data.map((u: University) => u.display_name) : []

  return {
    data,
    names,
    isLoading,
    error,
    isError,
  }
}
