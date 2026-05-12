import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, BarChart3, Shield, RefreshCw, ArrowRight, Github, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle animated background elements - toned down for professionalism */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen blur-3xl"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-violet-500 rounded-full mix-blend-screen blur-3xl"
          animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Top navigation bar - makes it feel like a real web app */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-inner">💰</div>
          <h1 className="text-2xl font-semibold text-white tracking-tighter">SmartExpenses</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-x-8 text-sm">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
        </div>

        <Link
          to="/register"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl transition-all active:scale-95"
        >
          Create free account
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pt-16 lg:pt-0"
      >
        {/* Left side - Professional branding (visible only on large screens) */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:flex col-span-7 flex-col justify-center pl-8 lg:pl-16"
        >
          <div className="max-w-lg">
            {/* Logo + tagline */}
            <div className="flex items-center gap-x-4 mb-10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl">💰</div>
              <div>
                <h1 className="text-7xl font-bold text-white tracking-tighter leading-none">
                  Smart
                </h1>
                <h1 className="text-7xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tighter leading-none">
                  Expenses
                </h1>
              </div>
            </div>

            <p className="text-2xl text-gray-300 leading-tight mb-12">
              The modern way to track, analyze, and optimize every dollar.
            </p>

            {/* Trust signals */}
            <div className="flex items-center gap-x-8 mb-12">
              <div className="flex items-center gap-x-2 text-emerald-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Bank-grade security</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
              <div className="text-sm text-gray-400">Trusted by 42,391 finance teams</div>
            </div>

            {/* Feature highlights with proper icons */}
            <div className="space-y-8">
              {[
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  desc: "AI-powered insights and spending forecasts",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  desc: "SOC 2 Type II, end-to-end encryption",
                },
                {
                  icon: RefreshCw,
                  title: "Instant Sync",
                  desc: "Real-time updates across all devices",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex gap-x-6"
                >
                  <div className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xl">{feature.title}</div>
                    <div className="text-gray-400 text-[15px]">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          variants={itemVariants}
          className="col-span-1 lg:col-span-5 max-w-[440px] mx-auto w-full"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-10">
            {/* Mobile logo header (visible on small screens) */}
            <div className="flex items-center gap-x-3 mb-8 lg:hidden">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white text-3xl">💰</div>
              <h1 className="text-3xl font-semibold text-white tracking-tighter">SmartExpenses</h1>
            </div>

            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
              <p className="text-gray-400">Sign in to continue managing your expenses</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300 block mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-gray-500 outline-none transition-all text-[15px]"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/5 border border-white/20 focus:border-indigo-400 focus:bg-white/10 rounded-2xl pl-11 pr-12 py-4 text-white placeholder:text-gray-500 outline-none transition-all text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-x-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-indigo-500 bg-white/10 border-white/30 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </motion.div>

              {/* Primary CTA */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-x-2 shadow-xl shadow-indigo-500/30 transition-all text-base"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="my-8 flex items-center gap-x-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Social buttons - more realistic */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-white text-sm font-medium transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-white text-sm font-medium transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-white text-sm font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>SSO</span>
              </button>
            </motion.div>

            {/* Sign up link */}
            <motion.div variants={itemVariants} className="text-center mt-8 text-sm">
              <span className="text-gray-400">Don&apos;t have an account?</span>{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Get started free →
              </Link>
            </motion.div>

            {/* Footer trust line */}
            <motion.p
              variants={itemVariants}
              className="text-center text-[10px] text-gray-500 mt-10 tracking-wider"
            >
              🔒 SECURE • SOC 2 • GDPR • 256-BIT ENCRYPTION
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login