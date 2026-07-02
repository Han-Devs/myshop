import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()

    const savedUsers = JSON.parse(localStorage.getItem('users')) || []

    const foundUser = savedUsers.find(
      (user) => user.email === email && user.password === password
    )

    if (!foundUser) {
      alert('Invalid email or password')
      return
    }

    localStorage.setItem('currentUser', JSON.stringify(foundUser))
    setCurrentUser(foundUser)

    alert('Login successful')
    navigate('/')
  }

  return (
  <section className="auth-page">
    <form className="auth-card" onSubmit={handleLogin}>
      <div className="auth-icon">👤</div>
      <h1>Customer Login</h1>
      <p>Welcome back to MyShop.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      <p className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  </section>
)
}

export default Login