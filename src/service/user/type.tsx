export interface EducationItem {
  status: 'student' | 'graduated' | 'not interested'
  graduationYear?: number
  topic?: string
  university?: string
}

export interface TravelItem {
  styles?: string[]
  countries?: string[]
}

export interface PetInfo {
  hasPet: boolean
  type?: string
  breed?: string
}

export interface UpdateUserParams {
  fullName?: string
  birthDate?: string
  gender?: string
  maritalStatus?: string
  education?: EducationItem[]
  travel?: TravelItem[]
  sport?: string
  skill?: string
  weight?: number
  height?: number
  bornPlace?: string
  livePlace?: string
  pet?: PetInfo
  interests?: string
  details?: string
}

export interface UploadProfileImageResponse {
  status: number
  message: string
  data: {
    url: string
  }
}
