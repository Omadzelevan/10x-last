import { useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '../types/user'
import { AuthContext } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)

  function login(username: string): void {
    setUser({ username, isLoggedIn: true })
  }

  function logout(): void {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
