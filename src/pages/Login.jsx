import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const loggedInUser = {
        ...data.user,
        name: data.user.username,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

      setCurrentUser(loggedInUser);

      alert("Login successful");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
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
  );
}

export default Login;