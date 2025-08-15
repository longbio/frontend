import { useEffect, useState } from 'react'
import { fetchCountriesAndFlags, fetchCountriesAndCities } from './function'
import type { FlagCountriesApiResponse, CountryAndCityApiResponse } from './types'

export function useFlagCountries() {
  const [data, setData] = useState<FlagCountriesApiResponse>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchCountriesAndFlags()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// NOTE: City & Country
export function useCountriesAndCities() {
  const [data, setData] = useState<CountryAndCityApiResponse>([])
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
