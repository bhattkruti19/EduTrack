import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import FacultyDashboard from './pages/FacultyDashboard'
import FacultyDataPage from './pages/FacultyDataPage'
import RiskPredictionPage from './pages/RiskPredictionPage'
import AssignCounsellor from './pages/AssignCounsellor'
import AddStudent from './pages/AddStudent'
import StudentDashboard from './pages/StudentDashboard'
import Attendance from './pages/Attendance'
import PredictCGPA from './pages/PredictCGPA'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function AppContent() {
  return (
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
      <Route path="/faculty/data" element={<FacultyDataPage />} />
      <Route path="/faculty/predict-risk" element={<RiskPredictionPage />} />
      <Route path="/faculty/assign-counsellor" element={<AssignCounsellor />} />
      <Route path="/faculty/student-overview" element={<Navigate to="/faculty/predict-risk" replace />} />
      <Route path="/faculty/subject-analytics" element={<Navigate to="/faculty/predict-risk" replace />} />

      {/* ── Counsellor auth routes ── */}
      <Route path="/counsellor/login" element={<SignInPage role="counsellor" />} />
      <Route path="/counsellor/signup" element={<SignUpPage role="counsellor" />} />
      <Route path="/counsellor/sign-in" element={<SignInPage role="counsellor" />} />
      <Route path="/counsellor/sign-up" element={<SignUpPage role="counsellor" />} />

      {/* ── Counsellor dashboard routes ── */}
      <Route path="/counsellor/home" element={<Navigate to="/counsellor/add-student" replace />} />
      <Route path="/counsellor/dashboard" element={<Navigate to="/counsellor/add-student" replace />} />
      <Route path="/counsellor/data" element={<Navigate to="/counsellor/add-student" replace />} />
      <Route path="/counsellor/add-student" element={<AddStudent />} />
      <Route path="/counsellor/predict-risk" element={<Navigate to="/counsellor/add-student" replace />} />
      <Route path="/counsellor/assign-counsellor" element={<Navigate to="/counsellor/add-student" replace />} />

      <Route path="/student/home" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/attendance" element={<Attendance />} />
      <Route path="/student/predict-cgpa" element={<PredictCGPA />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppRoutes() {
  const location = useLocation()
  const isRoleAuthRoute = /^\/(faculty|student|counsellor)\/(sign-in|sign-up|login|signup)\/?$/.test(
    location.pathname,
  )
  const isFacultyDashboard = location.pathname.startsWith('/faculty') && !isRoleAuthRoute
  const isCounsellorDashboard = location.pathname.startsWith('/counsellor') && !isRoleAuthRoute
  const isStudentDashboard = location.pathname.startsWith('/student') && !isRoleAuthRoute

  // ── Counsellor: same shared layout as faculty ────────────────────────────
  if (isCounsellorDashboard) {
    return (
      <div className="min-h-screen bg-edu-bg text-edu-navy">
        <Navbar />
        <Sidebar />
        <main className="mx-auto w-full max-w-7xl p-6">
          <AppContent />
        </main>
      </div>
    )
  }

  // ── Faculty: top navbar + horizontal nav + content ──────────────────────
  if (isFacultyDashboard) {
    return (
      <div className="min-h-screen bg-edu-bg text-edu-navy">
        <Navbar />
        <Sidebar />
        <main className="mx-auto w-full max-w-7xl p-6">
          <AppContent />
        </main>
      </div>
    )
  }

  // ── Student / public: original stacked layout ────────────────────────────
  return (
    <div className="min-h-screen text-edu-navy">
      {isStudentDashboard && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <main
        className={
          isStudentDashboard
            ? 'mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8'
            : 'mx-auto w-full max-w-6xl p-4 sm:p-8'
        }
      >
        <AppContent />
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
