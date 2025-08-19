import { http } from '@/http'
import type { University, OpenAlexInstitutionsResponse } from './types'

export async function fetchUniversities(): Promise<University[]> {
  try {
    const response = await http.get<OpenAlexInstitutionsResponse>(
      'https://api.openalex.org/institutions?per_page=50'
    )
    return response.results || []
  } catch (error) {
    console.error('Error fetching universities:', error)
    throw new Error('Failed to fetch universities')
  }
}
