import { Link } from 'react-router-dom';

export default function UserDashboard() {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <p className="dashboard-welcome">Welcome, User! You can fill forms and view your own data.</p>
      </div>
      <div className="dashboard-actions">
        <Link to="/application" className="btn dashboard-btn">Fill Internship Application</Link>
        <Link to="/profile" className="btn dashboard-btn">My Profile</Link>
      </div>
    </div>
  );
}
