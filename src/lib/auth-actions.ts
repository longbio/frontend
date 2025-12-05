'use server'
import { cookies } from 'next/headers'

export async function setAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  // Check if API is on a different domain (cross-origin scenario)
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const isCrossOrigin = apiUrl 
    ? (() => {
        try {
          const url = new URL(apiUrl)
          return url.hostname !== 'localhost' && !url.hostname.includes('127.0.0.1')
        } catch {
          return false
        }
      })()
    : false
  
  // Use 'lax' for cross-origin support, 'strict' for same-origin
  // 'lax' allows cookies to be sent with top-level navigations and same-site requests
  const sameSite = isCrossOrigin ? 'lax' : 'strict'
  // For cross-origin with HTTPS API, we may need secure cookies even in development
  // However, if frontend is HTTP and API is HTTPS, secure cookies won't work
  // So we only use secure when both are HTTPS or both are HTTP
  const needsSecure = process.env.NODE_ENV === 'production'
  
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: needsSecure,
    sameSite,
    maxAge: 60 * 15,
    path: '/',
  })
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: needsSecure,
    sameSite,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getAuthTokens() {
  const cookieStore = await cookies()
  return {
    accessToken: cookieStore.get('accessToken')?.value,
    refreshToken: cookieStore.get('refreshToken')?.value,
  }
}

export async function clearAuthTokens() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
}

export async function getAccessToken() {
  const { accessToken } = await getAuthTokens()
  return accessToken
}
