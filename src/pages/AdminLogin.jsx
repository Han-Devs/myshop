import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ isAdmin, setIsAdmin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin')
  }, [isAdmin, navigate])

  function handleAdminLogin(e) {
    e.preventDefault()

    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'admin123') {
      localStorage.setItem('isAdmin', JSON.stringify(true))
      setIsAdmin(true)
      alert('Admin login successful')
      navigate('/admin')
      return
    }

    alert('Invalid admin username or password')
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleAdminLogin}>
        <div className="auth-icon">🛠</div>
        <h1>Admin Login</h1>
        <p>Access your MyShop admin dashboard.</p>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login as Admin</button>
      </form>
    </section>
  )
}

export default AdminLogin