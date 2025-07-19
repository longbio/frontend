import { http } from '@/http'
import type { University } from './types'

export async function fetchUniversities(): Promise<University[]> {
  return http.get<University[]>('http://universities.hipolabs.com/search')
}
