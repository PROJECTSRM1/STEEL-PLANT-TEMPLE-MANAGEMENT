import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
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
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url("/images/OIP-21.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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

            <p className="forgot-password" onClick={() => navigate("/recover")}>
              Forgot Password?
            </p>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="extra-links">
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="signup-link"
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
