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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const defaultOptions: RequestInit = {
    headers,
    credentials: 'include',
  }
  const mergedOptions = merge({}, defaultOptions, options)

  let data: T = {} as T

  try {
    const response = await fetch(fullUrl.toString(), mergedOptions)

    if (response.status === 401) {
      throw new AuthError()
    }

    if (!response.ok) {
      data = {} as T
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

    // NOTE: We need this for react-query requests to work correctly
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
}
