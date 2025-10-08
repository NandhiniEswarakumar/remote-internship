import { Link } from 'react-router-dom';
export default function AdminDashboard() {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! You have access to all reports and user management.</p>
  <Link to="/offer-confirmation" className="btn mb-2">Confirm Offer</Link>
  <Link to="/applications-report" className="btn mb-2">Applications Report</Link>
  <Link to="/interview-schedule-report" className="btn mb-2">Interview Schedule Report</Link>
  <Link to="/offer-status-report" className="btn mb-2">Offer Status Report</Link>
    </div>
  );
}
