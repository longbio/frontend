// http.ts
import { merge } from 'lodash'
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'
import type { RequestOptions } from './types'
import { isClientSide } from '@/utils/environment'
import { objectToQueryString } from '@/utils/objects'
import { ApiError, AuthError } from '@/lib/exceptions'
import { getAuthTokens } from '@/lib/auth-actions'

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
  const fullUrl = new URL(url, process.env.NEXT_PUBLIC_API_BASE_URL)
  if (options.params) fullUrl.search = objectToQueryString(options.params)

  const headers: Record<string, string> = {}

  let body: BodyInit | null | undefined = undefined
  if (options.body !== undefined) {
    body = JSON.stringify(options.body)
    headers['Content-Type'] = 'application/json'
  }
  if (options.auth) {
    const tokens = isServer
      ? await getAuthTokens()
      : { accessToken: localStorage.getItem('accessToken') || undefined }
    if (tokens.accessToken) headers['Authorization'] = `Bearer ${tokens.accessToken}`
  }

  const mergedOptions: RequestInit = merge(
    {
      headers,
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
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    const e = error as Error
    handleError(e)
    if (e instanceof AuthError) redirectToLoginPage()
    if (options.throwError) throw new ApiError(e.message)
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
