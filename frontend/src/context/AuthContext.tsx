import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: any
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const navigate = useNavigate()

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
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

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
  }, [token])

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