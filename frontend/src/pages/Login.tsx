import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      // Error handled in context
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>

      <div className="flex w-full max-w-7xl mx-auto relative z-10">
        {/* LEFT SIDE - White Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-5/12 bg-white rounded-3xl shadow-2xl p-12 flex-col justify-center relative"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">FNCE.</h1>
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Log In</h2>
            <p className="text-gray-500 text-sm">
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Log In'
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">or</p>
            <div className="flex gap-3">
              <button className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium">
                <span className="flex items-center justify-center gap-2">
                  <span>🔍</span>
                  Log In
                </span>
              </button>
              <button className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium">
                <span>Log In</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Illustration Area */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex lg:w-7/12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-12 flex-col justify-center items-center relative overflow-hidden ml-8"
        >
          {/* Decorative circles */}
          <div className="absolute top-10 right-12 w-20 h-20 bg-white rounded-full opacity-40"></div>
          <div className="absolute top-24 right-20 w-28 h-28 bg-white rounded-full opacity-30"></div>
          <div className="absolute top-8 right-40 w-16 h-16 bg-white rounded-full opacity-35"></div>

          {/* Illustration box */}
          <div className="mb-8 relative z-10">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-80 h-48 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 150" fill="none">
                {/* Chart visualization */}
                <path d="M 20 120 Q 40 80, 60 90 Q 80 100, 100 70 Q 120 40, 140 50 Q 160 60, 180 30" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="40" cy="80" r="3" fill="#3b82f6" />
                <circle cx="80" cy="100" r="3" fill="#3b82f6" />
                <circle cx="120" cy="40" r="3" fill="#3b82f6" />
                <circle cx="160" cy="60" r="3" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center z-10 relative">
            <h3 className="text-2xl font-bold text-white mb-4">Get All Your Finances At One Place.</h3>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Bottom illustration - simple figure */}
          <div className="absolute bottom-8 right-12 text-6xl">
            👨‍💼
          </div>
        </motion.div>

        {/* Mobile layout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:hidden w-full px-6 py-8"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">FNCE.</h1>
              <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Log In</h2>
              <p className="text-gray-500 text-sm">
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Forgot Password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Log In'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login