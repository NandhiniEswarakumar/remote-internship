
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [applications, setApplications] = useState([]);

  // Load profile from localStorage or Firebase user
  useEffect(() => {
    if (currentUser) {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile_' + currentUser.email) || 'null');
      setProfile({
        firstName: storedProfile?.firstName || currentUser.displayName?.split(' ')[0] || '',
        lastName: storedProfile?.lastName || currentUser.displayName?.split(' ')[1] || '',
        email: currentUser.email || '',
      });
      const apps = JSON.parse(localStorage.getItem('applications') || '[]');
      setApplications(apps.filter(app => app.email === currentUser.email));
    }
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    // Save profile to localStorage
    localStorage.setItem('userProfile_' + profile.email, JSON.stringify({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email
    }));
    // Update all applications for this user with new name
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    const updatedApps = apps.map(app =>
      app.email === profile.email
        ? { ...app, firstName: profile.firstName, lastName: profile.lastName }
        : app
    );
    localStorage.setItem('applications', JSON.stringify(updatedApps));
    setApplications(updatedApps.filter(app => app.email === profile.email));
    alert('Profile updated and saved!');
  }

  return (
    <div className="container">
      <h2 className="mb-3 text-center">User Profile</h2>
      <form onSubmit={handleSave} className="mb-4">
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={profile.firstName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={profile.lastName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={profile.email} disabled />
          </div>
        </div>
        <button className="btn w-100 mb-2" type="submit">Save Profile</button>
      </form>
      <h3 className="mb-2">Your Applications</h3>
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan={4}>No applications found.</td></tr>
            ) : (
              applications.map((app, idx) => (
                <tr key={idx}>
                  <td>{app.position}</td>
                  <td>{app.department}</td>
                  <td>{app.status || 'Submitted'}</td>
                  <td>{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
