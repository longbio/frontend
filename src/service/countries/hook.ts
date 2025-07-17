import { useEffect, useState } from 'react'
import { fetchCountriesAndCities } from './function'
import { CountriesApiResponse } from './types'

export function useCountriesAndCities() {
  const [data, setData] = useState<CountriesApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchCountriesAndCities()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
