import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const Register = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(fullName, email, password)
    } catch {
      // Error handled in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Beautiful Accounting Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] bg-[length:50px_50px] opacity-5"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          {/* Logo/Icon */}
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/40 relative"
            >
              <TrendingUp className="w-16 h-16 text-slate-900" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white tracking-tight">ACCOUNTING</h1>
            <p className="text-xl text-blue-300 mt-3 font-medium">Smart Expense Tracker</p>
            
            <div className="mt-12 text-blue-200 text-sm max-w-xs mx-auto leading-relaxed">
              Join thousands of users tracking their expenses and building better financial habits today.
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute bottom-20 left-12 text-7xl opacity-5 font-bold">₹</div>
          <div className="absolute top-24 right-16 text-8xl opacity-5">📊</div>
        </div>

        {/* Subtle background circles */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-slate-950">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Create account</h2>
              <p className="text-slate-400 text-sm mt-2">Start managing your finances smarter</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all text-sm"
                  placeholder="Alex Rivera"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Email</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all pr-11 text-sm"
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-all mt-6"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-xs">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register