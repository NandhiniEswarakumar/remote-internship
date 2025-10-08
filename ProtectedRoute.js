import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: array of allowed roles, e.g. ['Admin', 'Manager']
export default function ProtectedRoute({ children, roles }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If not signed in, preserve the attempted location so Login can redirect back
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Get role from localStorage (for demo; in production, use backend or Firestore)
  const email = currentUser.email;
  // Default to 'User' when no role is present in localStorage (convenient for Google sign-ins)
  const userRole = localStorage.getItem('userRole_' + email) || 'User';

  // If user doesn't have required role, send them to home (instead of loop back to /login)
  if (roles && !roles.includes(userRole)) {
    // Show a friendly unauthorized message so user understands why access is denied
    return (
      <div style={{padding:24, textAlign:'center'}}>
        <h2>Access denied</h2>
        <p>You are signed in as <strong>{currentUser?.email || 'Unknown'}</strong>.</p>
  <p>Role: <strong>{userRole}</strong></p>
        <p>This page requires one of the roles: {roles.join(', ')}.</p>
        <div style={{marginTop:12}}>
          <a href="/" className="btn">Return to Home</a>
        </div>
      </div>
    );
  }

  return children;
}
