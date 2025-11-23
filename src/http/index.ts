import { merge } from 'lodash'
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'
import type { RequestOptions } from './types'
import { isClientSide } from '@/utils/environment'
import { objectToQueryString } from '@/utils/objects'
import { ApiError, AuthError } from '@/lib/exceptions'

const isServer = !isClientSide()

function redirectToLoginPage() {
  const loginRoute = '/auth/signin'
  if (isServer) redirect(loginRoute)
  else window.location.href = loginRoute
}

function handleError(error: Error) {
  const errorText = typeof error.message === 'string' ? error.message : ''
  if (isServer) console.error(errorText)
  else toast.error(errorText)
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL environment variable')

  const fullUrl = new URL(url, base)
  if (options.params) fullUrl.search = objectToQueryString(options.params)

  const headers: Record<string, string> = {}

  let body: BodyInit | null | undefined = undefined
  if (options.body !== undefined) {
    if (options.body instanceof FormData) {
      body = options.body
    } else {
      body = JSON.stringify(options.body)
      headers['Content-Type'] = 'application/json'
    }
  }

  const mergedOptions: RequestInit = merge(
    {
      headers,
      credentials: 'include',
    },
    options,
    { body }
  )

  try {
    const response = await fetch(fullUrl.toString(), mergedOptions)

    if (response.status === 401) throw new AuthError()

    if (!response.ok) {
      try {
        const errorData = await response.json().catch(() => null)
        const error = new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        ) as Error & {
          status?: number
          data?: { message?: string; [key: string]: any }
        }
        error.status = response.status
        error.data = errorData || { message: error.message }
        throw error
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`HTTP error! status: ${response.status}`)
        const errorWithStatus = error as Error & {
          status?: number
          data?: { message?: string; [key: string]: any }
        }
        errorWithStatus.status = response.status
        errorWithStatus.data = { message: error.message }
        throw errorWithStatus
      }
    }

    return await response.json()
  } catch (error) {
    const e = error as Error & {
      status?: number
      data?: { message?: string; [key: string]: any }
    }
    handleError(e)
    if (e instanceof AuthError) redirectToLoginPage()
    if (options.throwError) {
      // Preserve status and data if they exist
      if ('status' in e && 'data' in e) {
        throw e
      }
      throw new ApiError(e.message)
    }
    return {} as T
  }
}

export const http = {
  get: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { ...options, method: 'POST' }),
  put: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { ...options, method: 'PUT' }),
  patch: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { ...options, method: 'PATCH' }),
  delete: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
