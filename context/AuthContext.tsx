// context/AuthContext.tsx
'use client' // Only for Next.js 13+ App Router

import { createContext, useContext, useEffect, useState } from 'react'
 // For App Router
// import { useRouter } from 'next/router' // For Pages Router

interface User {
  id: number
  role: Role
  names: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json();
        
        if (response.ok) {
          setUser(data)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)