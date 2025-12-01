// Example types for service layer
export interface User {
  id: string
  name: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
}

export interface SignupParams {
  email?: string
  phoneNumber?: string
}

export interface VerifySignupCodeParams {
  email?: string
  phoneNumber?: string
  code: string
}
