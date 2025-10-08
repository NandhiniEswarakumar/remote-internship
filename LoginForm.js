
import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';


export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // location.state?.from is where the user originally tried to go
  const from = location.state?.from?.pathname || '/';


  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(emailRef.current.value, passwordRef.current.value);
      // If login returned a user, navigate back to original location (or home)
      if (result?.user) {
        navigate(from, { replace: true });
      }
    } catch {
      setError('Failed to log in');
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Google sign-in failed: ' + (err?.message || 'Unknown'));
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="text-center mb-3">Login</h2>
        {error && <div style={{color: 'red'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" ref={emailRef} required className="w-100" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" ref={passwordRef} required className="w-100" />
        </div>
          <button disabled={loading} className="btn w-100 mb-2">Log In</button>
          <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="btn w-100 mb-2">Sign in with Google</button>
        </form>
      </div>
    </div>
  );
}
