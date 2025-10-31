import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRecover = (e) => {
    e.preventDefault();
    alert('Password reset link sent to ' + email + ' (mock)');
    navigate('/');
  };

  return (
    <div className="auth-page recover-page">
      <div className="auth-box">
        <h3>RECOVER PASSWORD</h3>
        <p>Enter your email to recover your password:</p>
        <form onSubmit={handleRecover}>
          <input type="email" placeholder="E-mail" required value={email} onChange={e=>setEmail(e.target.value)} />
          <button type="submit">RECOVER</button>
        </form>
        <div className="extra-links">
          <Link to="/">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
