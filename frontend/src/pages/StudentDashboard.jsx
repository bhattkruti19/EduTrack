import AlertBanner from '../components/AlertBanner'

const profileDetails = [
  { label: 'Name', value: 'Kruti Patel' },
  { label: 'Enrollment ID', value: '22CE1045' },
  { label: 'Qualification', value: 'B.E.' },
  { label: 'Branch', value: 'Computer Engineering' },
  { label: 'Year', value: '3rd Year' },
  { label: 'Semester', value: 'Sem 6' },
]

const subjects = ['Data Structures', 'DBMS', 'Operating Systems', 'Machine Learning', 'Cloud Computing']

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-soft bg-gradient-to-r from-edu-teal to-edu-mint p-6 text-edu-navy shadow-soft">
        <p className="text-sm text-edu-navy/75">Student Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold">Welcome, Kruti</h1>
        <p className="mt-2 max-w-2xl text-sm text-edu-navy/80">
          Track your attendance, monitor subject progress, and estimate your CGPA with real-time insights.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">Current CGPA</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">8.42</h2>
        </div>
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">Attendance</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">84%</h2>
        </div>
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">Active Subjects</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">5</h2>
        </div>
      </section>

      <AlertBanner
        tone="attention"
        title="Profile Alert"
        message="Your profile is visible to faculty. Keep details updated for accurate analytics."
        actionLabel="Open Attendance"
        actionTo="/student/attendance"
      />

      <section className="rounded-soft bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-edu-navy">Profile Details</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {profileDetails.map((item) => (
            <div key={item.label} className="rounded-xl border border-edu-blue/15 bg-edu-bg p-3">
              <p className="text-xs uppercase tracking-wide text-edu-blue">{item.label}</p>
              <p className="mt-1 font-medium text-edu-navy">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-soft bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-edu-navy">Attendance Overview</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-edu-mint/35 p-4">
              <p className="text-sm text-edu-blue">Current Attendance</p>
              <p className="text-2xl font-bold text-edu-navy">84%</p>
            </div>
            <div className="rounded-xl bg-edu-sand/50 p-4">
              <p className="text-sm text-edu-blue">Classes Missed</p>
              <p className="text-2xl font-bold text-edu-navy">12</p>
            </div>
          </div>
        </section>

        <section className="rounded-soft bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold text-edu-navy">Subjects List</h2>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="rounded-lg border border-edu-blue/15 bg-edu-bg px-3 py-2 text-sm font-medium text-edu-navy transition hover:border-edu-teal"
              >
                {subject}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default StudentDashboard