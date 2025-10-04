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
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    profileImage?: string
    topImage?: string
    gender: string
    marital: string
    birthday: {
      day: string
      month: string
      year: string
    }
    country: {
      birthCountry: string
      birthCity: string
    }
    physical: {
      height: string
      weight: string
    }
    pet: {
      hasPet: boolean
      petName: string
      petBreed: string
      petImage?: string
    }
    interests: string[]
    skills: string[]
    sports: string[]
    education: string
  }
}
