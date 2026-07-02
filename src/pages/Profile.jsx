import { useState } from 'react'

function Profile({ currentUser, setCurrentUser }) {
  const [name, setName] = useState(currentUser?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleUpdate(e) {
    e.preventDefault()

    if (!currentUser) {
      alert('Please login first')
      return
    }

    if (!name) {
      alert('Username cannot be empty')
      return
    }

    const users = JSON.parse(localStorage.getItem('users')) || []
    let updatedPassword = currentUser.password

    if (currentPassword || newPassword || confirmPassword) {
      if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect')
        return
      }

      if (!newPassword || !confirmPassword) {
        alert('Please fill new password and confirm password')
        return
      }

      if (newPassword !== confirmPassword) {
        alert('New passwords do not match')
        return
      }

      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters')
        return
      }

      updatedPassword = newPassword
    }

    const updatedUser = {
      ...currentUser,
      name,
      password: updatedPassword,
    }

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? updatedUser : user
    )

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    setCurrentUser(updatedUser)

    alert('Profile updated successfully')

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your account information and password.</p>
          </div>
        </div>

        <div className="profile-info">
          <p>
            <strong>Name:</strong> {currentUser?.name}
          </p>
          <p>
            <strong>Email:</strong> {currentUser?.email}
          </p>
        </div>

        <form className="profile-form" onSubmit={handleUpdate}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h3>Change Password</h3>

          <label>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </section>
  )
}

export default Profile