import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(fullName, email, password)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    blob1: {
      position: 'absolute' as const,
      top: '10%',
      left: '10%',
      width: '380px',
      height: '380px',
      background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none' as const,
    },
    blob2: {
      position: 'absolute' as const,
      bottom: '10%',
      right: '10%',
      width: '460px',
      height: '460px',
      background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(90px)',
      pointerEvents: 'none' as const,
    },
    card: {
      position: 'relative' as const,
      width: '100%',
      maxWidth: '450px',
      background: 'rgba(30, 27, 75, 0.5)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      padding: '48px 40px',
      color: '#fff',
      zIndex: 10,
    },
    header: {
      marginBottom: '40px',
    },
    logo: {
      fontSize: '40px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      margin: '0 0 10px 0',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '15px',
      color: '#cbd5e1',
      margin: '0',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#cbd5e1',
      marginBottom: '10px',
    },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute' as const,
      left: '16px',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    input: {
      width: '100%',
      padding: '14px 14px 14px 48px',
      fontSize: '15px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
      background: 'rgba(255, 255, 255, 0.07)',
      color: '#fff',
    },
    inputFocus: {
      borderColor: 'rgba(99, 102, 241, 0.5)',
      background: 'rgba(99, 102, 241, 0.1)',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
    },
    toggleBtn: {
      position: 'absolute' as const,
      right: '16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#94a3b8',
      padding: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      transition: 'color 0.2s ease',
    },
    toggleBtnHover: {
      color: '#e2e8f0',
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '12px',
      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    submitBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)',
    },
    divider: {
      margin: '32px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      color: '#64748b',
      fontSize: '13px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '28px',
    },
    socialBtn: {
      padding: '12px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.07)',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#e2e8f0',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    socialBtnHover: {
      background: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 0.5)',
    },
    signinText: {
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#cbd5e1',
      marginTop: '24px',
    },
    signinLink: {
      color: '#6366f1',
      textDecoration: 'none',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    },
    signinLinkHover: {
      color: '#a78bfa',
    },
    footerText: {
      textAlign: 'center' as const,
      fontSize: '11px',
      color: '#64748b',
      marginTop: '20px',
      letterSpacing: '1px',
    },
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    Object.assign(e.target.style, styles.inputFocus)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
    e.target.style.background = 'rgba(255, 255, 255, 0.07)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={styles.container}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>💰</div>
          <h1 style={styles.title}>SmartExpenses</h1>
          <p style={styles.subtitle}>Create your free account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full name</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <User size={18} />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                style={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email address</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Create password</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ ...styles.input, paddingRight: '48px' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.toggleBtnHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: '#94a3b8' })}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
            onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.submitBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' })}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Creating account...
              </>
            ) : (
              'Create free account'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.socialButtons}>
          <button
            type="button"
            style={styles.socialBtn}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.socialBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255, 255, 255, 0.07)', borderColor: 'rgba(255, 255, 255, 0.15)' })}
          >
            Google
          </button>
          <button
            type="button"
            style={styles.socialBtn}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.socialBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255, 255, 255, 0.07)', borderColor: 'rgba(255, 255, 255, 0.15)' })}
          >
            GitHub
          </button>
          <button
            type="button"
            style={styles.socialBtn}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.socialBtnHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(255, 255, 255, 0.07)', borderColor: 'rgba(255, 255, 255, 0.15)' })}
          >
            SSO
          </button>
        </div>

        <div style={styles.signinText}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={styles.signinLink}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.signinLinkHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: '#6366f1' })}
          >
            Sign in
          </Link>
        </div>

        <p style={styles.footerText}>🔒 SECURE • SOC 2 • GDPR • 256-BIT ENCRYPTION</p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(203, 213, 225, 0.5);
        }
      `}</style>
    </div>
  )
}

export default Register
