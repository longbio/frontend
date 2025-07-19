import { useQuery } from '@tanstack/react-query'
import { fetchUniversities } from './function'

export function useUniversities() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universities'],
    queryFn: fetchUniversities,
  })
  const names = Array.isArray(data) ? data.map((u) => u.name) : []
  return { names, isLoading, error }
}
