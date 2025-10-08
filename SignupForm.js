
import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignupForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const roleRef = useRef();
  const { signup } = useAuth();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
      // Store role in localStorage (for demo; in production, use backend or Firestore)
      localStorage.setItem('userRole_' + emailRef.current.value, roleRef.current.value);
    } catch (err) {
      setError('Failed to create an account: ' + (err && err.message ? err.message : 'Unknown error'));
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const email = result.user?.email;
      // store role from roleRef if selected, otherwise default to 'User'
      const role = roleRef.current?.value || 'User';
      localStorage.setItem('userRole_' + email, role);
    } catch (err) {
      setError('Google sign-in failed: ' + (err?.message || 'Unknown'));
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="text-center mb-3">Sign Up</h2>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" ref={passwordConfirmRef} required className="w-100" />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select ref={roleRef} required className="w-100">
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
          <button disabled={loading} className="btn w-100 mb-2">Sign Up</button>
          <button type="button" onClick={handleGoogleSignup} disabled={loading} className="btn w-100 mb-2">Sign up with Google</button>
        </form>
      </div>
    </div>
  );
}
