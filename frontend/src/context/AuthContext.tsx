import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import toast from 'react-hot-toast'

interface User {
  fullName: string
  userId: number
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isInitialized, setIsInitialized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post('/auth/login', { email, password })
      const { token, fullName, userId } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ fullName, userId, email }))

      setToken(token)
      setUser({ fullName, userId, email })

      toast.success('Login successful!')
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const res = await API.post('/auth/register', { fullName, email, password })
      const { token, fullName: name, userId } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ fullName: name, userId, email }))

      setToken(token)
      setUser({ fullName: name, userId, email })

      toast.success('Account created successfully!')
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully')
  }

  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}