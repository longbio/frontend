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
  email: string
}

export interface VerifySignupCodeParams {
  email: string
  code: string
}
