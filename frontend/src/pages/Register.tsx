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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      padding: '40px',
    },
    header: {
      marginBottom: '30px',
    },
    logo: {
      fontSize: '32px',
      marginBottom: '15px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute' as const,
      left: '12px',
      color: '#9ca3af',
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      fontSize: '14px',
      border: '1.5px solid #e5e7eb',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    toggleBtn: {
      position: 'absolute' as const,
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'transform 0.2s, opacity 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '20px',
    },
    submitBtnDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    divider: {
      margin: '20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#d1d5db',
      fontSize: '14px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e5e7eb',
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginBottom: '20px',
    },
    socialBtn: {
      padding: '10px',
      border: '1.5px solid #e5e7eb',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.2s',
    },
    signinText: {
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '20px',
    },
    signinLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '700',
      cursor: 'pointer',
    },
    footerText: {
      textAlign: 'center' as const,
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '16px',
      letterSpacing: '1px',
    },
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    Object.assign(e.target.style, styles.inputFocus)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>💰</div>
          <h1 style={styles.title}>SmartExpenses</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.icon} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
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
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
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
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ ...styles.input, paddingRight: '40px' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
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
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderTop: '2px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
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
          <span>or sign up with</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.socialButtons}>
          <button type="button" style={styles.socialBtn}>Google</button>
          <button type="button" style={styles.socialBtn}>GitHub</button>
          <button type="button" style={styles.socialBtn}>SSO</button>
        </div>

        <div style={styles.signinText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.signinLink}>
            Sign in
          </Link>
        </div>

        <p style={styles.footerText}>🔒 SECURE • SOC 2 • GDPR</p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #667eea;
        }
        a {
          transition: color 0.2s;
        }
        a:hover {
          opacity: 0.8;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  )
}

export default Register
