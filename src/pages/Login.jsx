import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // keep your existing styles

const Login = () => {
  const navigate = useNavigate();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("templeUser"));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      // ✅ store authentication flag
      localStorage.setItem("isAuthenticated", "true");

      // ✅ navigate to dashboard
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Temple Dashboard Login</h2>
        <p className="subtitle">Swamiye Saranam Ayyappa</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="extra-links">
          <p onClick={() => navigate("/recover")}>Forgot Password?</p>
          <p onClick={() => navigate("/signup")}>Create an Account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
