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

export interface Topic {
  id: string
  name: string
  display_name: string
  description: string
  universities: University[]
}

export interface TopicsResponse {
  topics: Topic[]
  meta: {
    count: number
    last_updated: string
  }
}
