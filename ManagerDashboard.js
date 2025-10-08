import { Link } from 'react-router-dom';
export default function ManagerDashboard() {
  return (
    <div className="container">
      <h2>Manager Dashboard</h2>
      <p>Welcome, Manager! You can access intermediate forms and reports.</p>
  <Link to="/interview" className="btn mb-2">Schedule Interview</Link>
  <Link to="/interview-feedback" className="btn mb-2">Submit Interview Feedback</Link>
  <Link to="/offer-confirmation" className="btn mb-2">Confirm Offer</Link>
  <Link to="/applications-report" className="btn mb-2">Applications Report</Link>
  <Link to="/interview-schedule-report" className="btn mb-2">Interview Schedule Report</Link>
  <Link to="/offer-status-report" className="btn mb-2">Offer Status Report</Link>
    </div>
  );
}
