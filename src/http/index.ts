import { merge } from 'lodash'
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'
import type { RequestOptions } from './types'
import { isClientSide } from '@/utils/environment'
import { objectToQueryString } from '@/utils/objects'
import { ApiError, AuthError } from '@/lib/exceptions'
import { getAuthTokens, setAuthTokens } from '@/lib/auth-actions'

const isServer = !isClientSide()

function redirectToLoginPage() {
  const loginRoute = '/auth/signin'

  if (isServer) {
    redirect(loginRoute)
  }

  window.location.href = loginRoute
}

function handleError(error: Error) {
  const errorText = typeof error.message === 'string' ? error.message : ''

  if (isServer) {
    console.error(errorText)
    return
  }

  toast.error(errorText)
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const fullUrl = new URL(url, process.env.NEXT_PUBLIC_API_BASE_URL)

  if (options.params) {
    fullUrl.search = objectToQueryString(options.params)
  }

  const headers: Record<string, string> = {}

  let processedBody: BodyInit | null | undefined = options.body

  if (
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    processedBody = JSON.stringify(options.body)
    headers['Content-Type'] = 'application/json'
  }

  let accessToken: string | undefined
  let refreshToken: string | undefined

  if (isServer) {
    const tokens = await getAuthTokens()
    accessToken = tokens.accessToken
    refreshToken = tokens.refreshToken
  } else {
    accessToken = localStorage.getItem('accessToken') || undefined
    refreshToken = localStorage.getItem('refreshToken') || undefined
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  if (refreshToken) {
    headers['X-Refresh-Token'] = refreshToken
  }

  const defaultOptions: RequestInit = {
    headers,
    credentials: 'include',
  }

  const mergedOptions = merge({}, defaultOptions, options, {
    body: processedBody,
  })

  let data: T = {} as T

  try {
    const response = await fetch(fullUrl.toString(), mergedOptions)

    if (response.status === 401) {
      if (isServer) {
        const tokens = await getAuthTokens()
        if (tokens.refreshToken) {
          // await refreshAccessToken(tokens.refreshToken)
        }
      }
      throw new AuthError()
    }

    const newAccessToken = response.headers.get('x-access-token')
    const newRefreshToken = response.headers.get('x-refresh-token')

    if (newAccessToken && newRefreshToken && isServer) {
      await setAuthTokens(newAccessToken, newRefreshToken)
    }

    if (!response.ok) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    try {
      data = await response.json()
    } catch {
      throw new Error('لطفا مجددا صفحه را بارگذاری نمایید.')
    }

    return data
  } catch (error) {
    const e = error as Error

    handleError(e)

    if (e instanceof AuthError) {
      redirectToLoginPage()
    }

    if (options.throwError) {
      throw new ApiError(e.message)
    }

    return {} as T
  }
}

export const http = {
  get: <T>(url: string, options: RequestOptions = {}) => {
    return request<T>(url, { ...options, method: 'GET' })
  },

  post: <T>(url: string, options: RequestOptions = {}) => {
    return request<T>(url, { ...options, method: 'POST' })
  },

  put: <T>(url: string, options: RequestOptions = {}) => {
    return request<T>(url, { ...options, method: 'PUT' })
  },

  delete: <T>(url: string, options: RequestOptions = {}) => {
    return request<T>(url, { ...options, method: 'DELETE' })
  },

  patch: <T>(url: string, options: RequestOptions = {}) => {
    return request<T>(url, { ...options, method: 'PATCH' })
  },
}
