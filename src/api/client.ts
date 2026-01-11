import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../context/auth-store'

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '')

const resolveBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!fromEnv || fromEnv.length === 0) {
    throw new Error('Missing VITE_API_BASE_URL; set your backend URL in the environment.')
  }
  return normalizeBaseUrl(fromEnv)
}

export const API_BASE_URL = resolveBaseUrl()
export const API_VERSION = import.meta.env.VITE_API_VERSION?.trim() || 'v1.1'
export const API_ENDPOINT_PREFIX = `/api/${API_VERSION}`

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean }
const isAuthErrorStatus = (status?: number) => status === 401 || status === 419
const shouldSkipRefresh = (url?: string) => {
  if (!url) {
    return true
  }
  return [`${API_ENDPOINT_PREFIX}/auth/login`, `${API_ENDPOINT_PREFIX}/auth/register`, `${API_ENDPOINT_PREFIX}/auth/refresh`, `${API_ENDPOINT_PREFIX}/auth/logout`].some(path =>
    url.includes(path),
  )
}

let refreshRequest: Promise<void> | null = null

const refreshSession = async () => {
  if (!refreshRequest) {
    refreshRequest = apiClient
      .post(`${API_ENDPOINT_PREFIX}/auth/refresh`)
      .then(() => { })
      .finally(() => {
        refreshRequest = null
      })
  }
  return refreshRequest
}

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status as number | undefined
    const originalRequest = error.config as RetriableRequest | undefined

    if (
      originalRequest &&
      isAuthErrorStatus(status) &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        await refreshSession()
        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    if (status === 401 && !originalRequest?.url?.includes('/auth/password/change')) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
