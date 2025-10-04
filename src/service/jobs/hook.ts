'use client'
import { useState, useEffect } from 'react'
import { fetchJobPositions, fetchCompaniesForPosition, type JobPosition } from './function'

export function useJobPositions() {
  const [data, setData] = useState<JobPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchJobPositions()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useCompaniesForPosition(positionId: string | null) {
  const [data, setData] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!positionId) {
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    fetchCompaniesForPosition(positionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [positionId])

  return { data, loading, error }
}
