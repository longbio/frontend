'use server'

import { setAuthTokens } from '@/lib/auth-actions'
import type { VerifySignupCodeParams } from '@/service/auth/types'

/**
 * Server action to verify authentication code for both signin and signup flows.
 * This handles cross-origin cookie issues by:
 * 1. Making the request from the Next.js server (not client)
 * 2. Extracting tokens from response body or Set-Cookie headers
 * 3. Setting cookies on the Next.js server domain (localhost) instead of backend domain
 * 
 * This ensures cookies are properly accessible when frontend (localhost) 
 * communicates with backend (api.longbio.me) in cross-origin scenarios.
 */
export async function verifyAuthCodeServerAction(
  params: VerifySignupCodeParams
): Promise<{
  status: number
  message: string
  data?: { isNewUser?: boolean }
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiUrl) {
    throw new Error('API base URL is not configured')
  }

  try {
    const response = await fetch(`${apiUrl}/v1/auth/verification-code/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      credentials: 'include',
    })

    const data = await response.json().catch(() => ({
      status: response.status,
      message: `HTTP error! status: ${response.status}`,
    }))

    // Extract tokens from response body if present
    if (data.accessToken && data.refreshToken) {
      await setAuthTokens(data.accessToken, data.refreshToken)
    } else {
      // Try to extract tokens from Set-Cookie headers
      // Note: In Node.js fetch, Set-Cookie headers are accessible via headers.getSetCookie()
      let accessToken: string | null = null
      let refreshToken: string | null = null

      // Check if getSetCookie is available (Node.js 18+)
      if (typeof response.headers.getSetCookie === 'function') {
        const setCookieHeaders = response.headers.getSetCookie()
        
        for (const cookieHeader of setCookieHeaders) {
          // Parse cookie header (format: "name=value; attributes")
          const cookieMatch = cookieHeader.match(/^([^=]+)=([^;]+)/)
          if (cookieMatch) {
            const [, name, value] = cookieMatch
            if (name === 'accessToken') {
              accessToken = decodeURIComponent(value)
            } else if (name === 'refreshToken') {
              refreshToken = decodeURIComponent(value)
            }
          }
        }
      } else {
        // Fallback: try to get Set-Cookie header manually
        const setCookieHeader = response.headers.get('set-cookie')
        if (setCookieHeader) {
          const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
          for (const cookieStr of cookies) {
            const cookieMatch = cookieStr.match(/(?:^|;\s*)(accessToken|refreshToken)=([^;]+)/)
            if (cookieMatch) {
              const [, name, value] = cookieMatch
              if (name === 'accessToken') {
                accessToken = decodeURIComponent(value.trim())
              } else if (name === 'refreshToken') {
                refreshToken = decodeURIComponent(value.trim())
              }
            }
          }
        }
      }

      if (accessToken && refreshToken) {
        await setAuthTokens(accessToken, refreshToken)
      }
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `HTTP error! status: ${response.status}`
      ) as Error & {
        status?: number
        data?: { message?: string; [key: string]: any }
      }
      error.status = response.status
      error.data = data || { message: error.message }
      throw error
    }

    return {
      status: response.status,
      message: data.message || 'Verification successful',
      data: data.data,
    }
  } catch (error) {
    const e = error as Error & {
      status?: number
      data?: { message?: string; [key: string]: any }
    }
    
    // Re-throw if it's already an error with status
    if ('status' in e && typeof e.status === 'number') {
      throw e
    }
    
    // Wrap unexpected errors
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred'
    const wrappedError = new Error(errorMessage) as Error & {
      status: number
      message: string
      data?: { message?: string; [key: string]: any }
    }
    wrappedError.status = 500
    wrappedError.message = errorMessage
    wrappedError.data = { message: errorMessage }
    throw wrappedError
  }
}

