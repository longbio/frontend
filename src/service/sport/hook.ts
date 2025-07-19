import { Sport } from '../sport/type'
import { useEffect, useState } from 'react'
import { fetchSports } from '../sport/function'

export function useSports() {
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSports()
        setSports(data.sports ?? [])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { sports, loading, error }
}
