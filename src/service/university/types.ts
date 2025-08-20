export interface University {
  id: string
  name: string
  display_name: string
  country_code: string
  type: string
  homepage_url: string
  image_url: string
  image_thumbnail_url: string
  works_count: number
  cited_by_count: number
  city: string
  region: string
}

export interface OpenAlexInstitutionsResponse {
  results: University[]
  meta: {
    count: number
    db_response_time_ms: number
    page: number
    per_page: number
  }
}
