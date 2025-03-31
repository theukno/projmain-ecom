"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      console.log('Checking authentication...')
      // First check localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        console.log('Found stored user:', storedUser)
        setUser(JSON.parse(storedUser))
        setIsLoading(false)
        return
      }

      // If no stored user, check the server
      console.log('No stored user, checking server...')
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        console.log('Server returned user:', data.user)
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        console.log('Server check failed:', response.status)
        setUser(null)
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      console.log('Attempting login...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()
      console.log('Login successful:', data.user)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Login error:', error)
      setUser(null)
      localStorage.removeItem('user')
      throw error
    }
  }

  async function logout() {
    try {
      console.log('Logging out...')
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      localStorage.removeItem('user')
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 