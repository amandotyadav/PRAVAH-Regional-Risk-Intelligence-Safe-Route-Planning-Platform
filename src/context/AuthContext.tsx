import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { UNAUTHORIZED_EVENT, clearSession, getStoredToken, getStoredUsername, storeSession } from '../services/api'
import { login as loginRequest } from '../services/pravah'
import type { TokenClaims } from '../types'

export interface AuthState {
  token: string | null
  username: string | null
  /** Role as issued by the backend in the token, e.g. "dispatcher". */
  role: string | null
  isSignedIn: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

/** Read the unsigned claims the backend puts in the JWT. No verification here. */
function readClaims(token: string | null): TokenClaims | null {
  if (!token) return null
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const normalised = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(normalised.padEnd(Math.ceil(normalised.length / 4) * 4, '='))
    return JSON.parse(decoded) as TokenClaims
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [username, setUsername] = useState<string | null>(() => getStoredUsername())

  const signOut = useCallback(() => {
    clearSession()
    setToken(null)
    setUsername(null)
  }, [])

  // The API layer raises this when the backend rejects an expired token.
  useEffect(() => {
    const handle = () => signOut()
    window.addEventListener(UNAUTHORIZED_EVENT, handle)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handle)
  }, [signOut])

  const signIn = useCallback(async (name: string, password: string) => {
    const result = await loginRequest(name, password)
    storeSession(result.access_token, name)
    setToken(result.access_token)
    setUsername(name)
  }, [])

  const value = useMemo<AuthState>(() => {
    const claims = readClaims(token)
    return {
      token,
      username,
      role: claims?.role ?? null,
      isSignedIn: token !== null,
      signIn,
      signOut,
    }
  }, [token, username, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
