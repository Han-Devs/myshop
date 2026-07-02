import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register({ setCurrentUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  function handleRegister(e) {
    e.preventDefault()

    if (!name || !email || !password) {
      alert('Please fill all fields')
      return
    }

    const savedUsers = JSON.parse(localStorage.getItem('users')) || []

    const existingUser = savedUsers.find((user) => user.email === email)

    if (existingUser) {
      alert('Email already registered')
      return
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    }

    const updatedUsers = [...savedUsers, newUser]

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    setCurrentUser(newUser)

    alert('Account created successfully')
    navigate('/')
  }

 return (
  <section className="auth-page">
    <form className="auth-card" onSubmit={handleRegister}>
      <div className="auth-icon">✨</div>
      <h1>Create Account</h1>
      <p>Join MyShop and start shopping smarter.</p>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <button type="submit">Register</button>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  </section>
)
}

export default Register