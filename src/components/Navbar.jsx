import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [openProfile, setOpenProfile] = useState(false)
  const isFaculty = location.pathname.startsWith('/faculty')
  const rolePrefix = location.pathname.startsWith('/faculty') ? '/faculty' : '/student'

  const profile = isFaculty
    ? {
        name: 'Kruti Bhatt',
        email: 'kruti.bhatt@gcet.ac.in',
        department: 'Computer Engineering Department',
      }
    : {
        name: 'Kruti Bhatt',
        email: '12302130501080@gcet.ac.in',
        department: 'Computer Engineering',
      }

  const profileActions = [
    {
      label: 'View Profile',
      onClick: () => navigate(`${rolePrefix}/dashboard`),
    },
    {
      label: 'Edit Profile',
      onClick: () => navigate(`${rolePrefix}/dashboard`),
    },
    {
      label: 'Logout',
      onClick: () => navigate('/landing'),
    },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-edu-blue/15 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-edu-navy">EduTrack Dashboard</h2>
          <p className="text-xs text-edu-blue">Academic Performance & Engagement</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenProfile((state) => !state)}
            className="flex items-center gap-2 rounded-soft border border-edu-blue/20 bg-white/90 px-3 py-2 text-sm text-edu-navy shadow-soft transition hover:-translate-y-0.5 hover:bg-edu-blue/10"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-edu-teal/25 text-xs font-semibold">
              {profile.name[0]}
            </span>
            <span className="hidden sm:block">{profile.name}</span>
            <span>▾</span>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-80 rounded-soft border border-edu-blue/20 bg-white/95 p-4 shadow-[0_16px_40px_rgba(33,93,135,0.2)] backdrop-blur-sm">
              <div className="flex flex-col items-center border-b border-edu-blue/10 pb-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-edu-blue/35 to-edu-teal/30 text-4xl font-medium text-edu-navy">
                  {profile.name[0]}
                </div>
                <p className="mt-3 text-2xl font-semibold text-edu-navy">{profile.name}</p>
                <p className="mt-1 text-sm text-edu-blue">{profile.email}</p>
                <p className="mt-1 text-sm text-edu-blue">{profile.department}</p>
              </div>

              <div className="mt-3 space-y-1">
                {profileActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      action.onClick()
                      setOpenProfile(false)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-edu-navy transition hover:bg-edu-blue/12"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar