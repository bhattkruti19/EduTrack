import { NavLink, useLocation } from 'react-router-dom'

const facultyLinks = [
  { label: 'Dashboard', to: '/faculty/dashboard' },
  { label: 'Student Overview', to: '/faculty/student-overview' },
  { label: 'Subject Analytics', to: '/faculty/subject-analytics' },
]

const studentLinks = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Attendance', to: '/student/attendance' },
  { label: 'Predict CGPA', to: '/student/predict-cgpa' },
]

function Sidebar() {
  const location = useLocation()
  const isFacultyPath = location.pathname.startsWith('/faculty')
  const roleLinks = isFacultyPath ? facultyLinks : studentLinks

  return (
    <nav className="border-b border-edu-blue/20 bg-gradient-to-r from-edu-navy via-edu-blue to-edu-navy px-4 py-3 text-white shadow-soft sm:px-6 lg:px-8">
      <div
        className="mx-auto grid w-full max-w-7xl gap-2 text-sm"
        style={{ gridTemplateColumns: `repeat(${roleLinks.length}, minmax(0, 1fr))` }}
      >
        {roleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `truncate rounded-xl px-3 py-2.5 text-center font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-edu-teal to-edu-blue text-white shadow-[0_8px_20px_rgba(47,164,169,0.35)]'
                  : 'text-white/90 hover:bg-white/12'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar