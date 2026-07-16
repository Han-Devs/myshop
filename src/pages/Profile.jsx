import { useState, useEffect } from "react";
import { API_BASE_URL } from '../config/api'
function Profile({ currentUser, setCurrentUser }) {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }

        const backendUser = {
          ...data.user,
          name: data.user.username,
        };

        setCurrentUser(backendUser);
        localStorage.setItem("currentUser", JSON.stringify(backendUser));
        setName(data.user.username);
      } catch (error) {
        console.error(error);
        alert("Server error");
      }
    }

    fetchProfile();
  }, [setCurrentUser]);

  async function handleUpdate(e) {
    e.preventDefault();

    if (!name) {
      alert("Username cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: name,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const updatedUser = {
        ...data.user,
        name: data.user.username,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      alert("Profile updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
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
  );
}

export default Profile;