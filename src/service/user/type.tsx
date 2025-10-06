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
  educationalStatus?: string
  education?: {
    topic?: string
    university?: string
    graduationYear?: string
  }
  jobStatus?: string
  job?: {
    position?: string
    company?: string
  }
  travelStyle?: string
  favoriteSport?: string
  skill?: string[]
  weight?: number
  height?: number
  bornPlace?: string
  livePlace?: string
  pet?: PetInfo
  interests?: string[]
  details?: string
}

export interface UploadProfileImageResponse {
  status: number
  message: string
  data: {
    url: string
  }
}

export interface GetUserByIdResponse {
  status: number
  message: string
  data: {
    id: number
    birthDate: string | null
    email: string
    fullName: string
    job: string
    travelStyle: string
    favoriteSport: string
    gender: string
    maritalStatus: string
    educationalStatus: string
    profileImage: string
    height: number
    weight: number
    bornPlace: string
    livePlace: string
    pet: {
      name: string
      breed: string
    }
    doesExercise: boolean
    skills: string[]
    interests: string[]
    visitedCountries: string[]
    details: string
    createdAt: string
    updatedAt: string
  }
}
