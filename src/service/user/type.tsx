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
  username?: string
  birthDate?: string
  gender?: string
  maritalStatus?: string
  educationalStatus?: string
  education?: {
    topic?: string | null
    university?: string | null
    graduationYear?: string | null
  }
  jobStatus?: string
  job?: {
    position?: string
    company?: string
  }
  travelStyle?: string[]
  visitedCountries?: string[]
  favoriteSport?: string[]
  skills?: string[]
  weight?: number | null
  height?: number | null
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
    username: string
    birthDate: string | null
    fullName: string
    gender: string
    maritalStatus: string
    educationalStatus: string
    profileImage: string
    isVerified?: boolean
    height?: number
    weight?: number
    bornPlace: string
    livePlace: string
    doesExercise: boolean
    favoriteSport: string[]
    travelStyle: string[]
    details: string
    education: {
      topic?: string
      university?: string
      graduationYear?: string
    }
    job: {
      company: string
      position: string
    }
    pet: {
      name: string
      breed: string
    }
    skills: string[] | null
    interests: string[] | null
    visitedCountries: string[] | null
  }
}
