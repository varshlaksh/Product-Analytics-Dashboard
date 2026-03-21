import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'
import { setToken, getToken } from '../utils/auth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('login') // 'login' | 'register'
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // login fields
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })

  // register fields
  const [regForm, setRegForm] = useState({ username: '', password: '', age: '', gender: '' })

  useEffect(() => {
    if (getToken()) navigate('/dashboard', { replace: true })
  }, [navigate])

  const switchTab = (t) => { setTab(t); setError('') }

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.username || !loginForm.password) return setError('Please fill in all fields.')
    setLoading(true); setError('')
    try {
      const data = await login(loginForm.username, loginForm.password)
      setToken(data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault()
    const { username, password, age, gender } = regForm
    if (!username || !password || !age || !gender) return setError('Please fill in all fields.')
    setLoading(true); setError('')
    try {
      await register(username, password, parseInt(age), gender)
      switchTab('login')
      setLoginForm((f) => ({ ...f, username }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* animated background blobs */}
      <div className={styles.bgLayer}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={styles.wrapper}>
        {/* brand */}
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>Analytics OS</span>
        </div>

        <div className={styles.card}>
          {/* tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => switchTab('register')}
            >
              Register
            </button>
          </div>

          {/* error */}
          {error && <div className={styles.errorBox}>{error}</div>}

          {/* ── Login Form ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} noValidate>
              <div className={styles.formHead}>
                <h1>Welcome back</h1>
                <p>// enter your credentials to continue</p>
              </div>

              <div className={styles.field}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="your_username"
                  autoComplete="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          )}

          {/* ── Register Form ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate>
              <div className={styles.formHead}>
                <h1>Create account</h1>
                <p>// join the analytics platform</p>
              </div>

              <div className={styles.field}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="your_username"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    min="1" max="120"
                    value={regForm.age}
                    onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label>Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating…' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
