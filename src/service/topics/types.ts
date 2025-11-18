export interface University {
  name: string
}

export interface Topic {
  id: string
  name: string
  universities: University[]
}

export interface TopicsResponse {
  topics: Topic[]
}
