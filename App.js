
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import ThemeToggle from './components/ThemeToggle';
import InternshipList from './components/InternshipList';
import InternshipTable from './components/InternshipTable';
import ApplicationStatusChart from './components/ApplicationStatusChart';
import DeadlineTracker from './components/DeadlineTracker';
import CompanyInsightsReport from './reports/CompanyInsightsReport';
import FeedbackReport from './reports/FeedbackReport';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ApplicationForm from './forms/ApplicationForm';
import InterviewForm from './forms/InterviewForm';
import InterviewFeedbackForm from './forms/InterviewFeedbackForm';
import OfferConfirmationForm from './forms/OfferConfirmationForm';
import ApplicationsReport from './reports/ApplicationsReport';
import InterviewScheduleReport from './reports/InterviewScheduleReport';
import OfferStatusReport from './reports/OfferStatusReport';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/admin" element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user" element={
            <ProtectedRoute roles={["User"]}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager" element={
            <ProtectedRoute roles={["Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/application" element={<ProtectedRoute roles={["User"]}><ApplicationForm /></ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><InternshipList /></ProtectedRoute>} />
          <Route path="/internship-table" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><InternshipTable /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute roles={["Manager", "Admin"]}><InterviewForm /></ProtectedRoute>} />
          <Route path="/interview-feedback" element={<ProtectedRoute roles={["Manager", "Admin"]}><InterviewFeedbackForm /></ProtectedRoute>} />
          <Route path="/offer-confirmation" element={<ProtectedRoute roles={["Manager", "Admin"]}><OfferConfirmationForm /></ProtectedRoute>} />
          <Route path="/applications-report" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><ApplicationsReport /></ProtectedRoute>} />
          <Route path="/application-status-chart" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><ApplicationStatusChart /></ProtectedRoute>} />
          <Route path="/deadlines" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><DeadlineTracker /></ProtectedRoute>} />
          <Route path="/interview-schedule-report" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><InterviewScheduleReport /></ProtectedRoute>} />
          <Route path="/offer-status-report" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><OfferStatusReport /></ProtectedRoute>} />
          <Route path="/company-insights" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><CompanyInsightsReport /></ProtectedRoute>} />
          <Route path="/feedback-report" element={<ProtectedRoute roles={["Manager", "Admin", "User"]}><FeedbackReport /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute roles={["User"]}><UserProfile /></ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

  function Nav() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logout();
        localStorage.removeItem('userRole_' + (currentUser?.email || ''));
        navigate('/login');
      } catch (e) { console.error(e); }
    };

    return (
      <nav className="container mb-3" style={{display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center'}}>
        <Link to="/">Home</Link>
        <Link to="/internships">Internships</Link>
        <Link to="/internship-table">Internship Table</Link>
        <Link to="/applications-report">Applications</Link>
        <Link to="/company-insights">Company Insights</Link>
        <Link to="/feedback-report">Feedback</Link>
        <div style={{marginLeft:12}}><ThemeToggle /></div>
        <div style={{marginLeft:12}}>
          {!currentUser ? (
            <>
              <Link to="/login">Login</Link>
              <span style={{margin:'0 8px'}}>/</span>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <button className="btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>
    );
  }

export default App;
