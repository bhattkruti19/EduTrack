import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import FacultyDashboard from './pages/FacultyDashboard'
import FacultyStudentOverview from './pages/FacultyStudentOverview'
import FacultySubjectAnalytics from './pages/FacultySubjectAnalytics'
import StudentDashboard from './pages/StudentDashboard'
import Attendance from './pages/Attendance'
import PredictCGPA from './pages/PredictCGPA'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function AppRoutes() {
  const location = useLocation()
  const isRoleAuthRoute = /^\/(faculty|student)\/(sign-in|sign-up|login|signup)\/?$/.test(
    location.pathname,
  )
  const showDashboardNav =
    (location.pathname.startsWith('/faculty') || location.pathname.startsWith('/student')) &&
    !isRoleAuthRoute

  return (
    <div className="min-h-screen text-edu-navy">
      {showDashboardNav && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

      <main className={showDashboardNav ? 'mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8' : 'mx-auto w-full max-w-6xl p-4 sm:p-8'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/landing" replace />} />
          <Route path="/sign-in" element={<Navigate to="/landing" replace />} />
          <Route path="/sign-up" element={<Navigate to="/landing" replace />} />
          <Route path="/student/login" element={<SignInPage role="student" />} />
          <Route path="/faculty/login" element={<SignInPage role="faculty" />} />
          <Route path="/student/signup" element={<SignUpPage role="student" />} />
          <Route path="/faculty/signup" element={<SignUpPage role="faculty" />} />
          <Route path="/student/sign-in" element={<SignInPage role="student" />} />
          <Route path="/faculty/sign-in" element={<SignInPage role="faculty" />} />
          <Route path="/student/sign-up" element={<SignUpPage role="student" />} />
          <Route path="/faculty/sign-up" element={<SignUpPage role="faculty" />} />

          <Route path="/faculty/home" element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/student-overview" element={<FacultyStudentOverview />} />
          <Route path="/faculty/subject-analytics" element={<FacultySubjectAnalytics />} />

          <Route path="/student/home" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<Attendance />} />
          <Route path="/student/predict-cgpa" element={<PredictCGPA />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
