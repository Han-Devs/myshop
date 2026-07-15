import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ setIsAdmin, setCurrentUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleAdminLogin(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter email and password')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      if (data.user?.role !== 'admin') {
        setError('This account does not have admin access')
        return
      }

      const adminUser = {
        ...data.user,
        name: data.user.username,
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'currentUser',
        JSON.stringify(adminUser)
      )
      localStorage.setItem('isAdmin', JSON.stringify(true))

      setCurrentUser(adminUser)
      setIsAdmin(true)

      navigate('/admin')
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleAdminLogin}>
        <div className="auth-icon">🛠️</div>

        <h1>Admin Login</h1>
        <p>Sign in using your MongoDB admin account.</p>

        {error && <p className="checkout-error">{error}</p>}

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Admin Login'}
        </button>
      </form>
    </section>
  )
}

export default AdminLogin