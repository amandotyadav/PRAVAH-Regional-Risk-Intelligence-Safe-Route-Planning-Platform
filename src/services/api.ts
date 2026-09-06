import axios, { AxiosError, type AxiosInstance } from 'axios'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

const TOKEN_KEY = 'pravah.token'
const USERNAME_KEY = 'pravah.username'

export function getStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function storeSession(token: string, username: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.localStorage.setItem(USERNAME_KEY, username)
  } catch {
    /* storage unavailable (private mode); the session simply won't persist */
  }
}

export function getStoredUsername(): string | null {
  try {
    return window.localStorage.getItem(USERNAME_KEY)
  } catch {
    return null
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USERNAME_KEY)
  } catch {
    /* nothing to clear */
  }
}

/** Raised when the backend rejects the token, so the shell can return to sign-in. */
export const UNAUTHORIZED_EVENT = 'pravah:unauthorized'

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 60_000,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearSession()
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)

export { BASE_URL }
