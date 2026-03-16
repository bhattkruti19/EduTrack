import DashboardCard from '../components/DashboardCard'
import AlertBanner from '../components/AlertBanner'

function FacultyDashboard() {

  return (
    <div className="space-y-6">
      <section className="rounded-soft bg-gradient-to-r from-edu-navy to-edu-blue p-6 text-white shadow-soft">
        <p className="text-sm text-white/80">Faculty Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold">Welcome back, Professor</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          View academic risk trends, monitor engagement, and manage performance insights in one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">Today&apos;s Classes</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">6</h2>
        </div>
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">Pending Reviews</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">14</h2>
        </div>
        <div className="rounded-soft bg-white p-5 shadow-soft">
          <p className="text-sm text-edu-blue">At-Risk Alerts</p>
          <h2 className="mt-1 text-2xl font-bold text-edu-navy">9</h2>
        </div>
      </section>

      <AlertBanner
        tone="warning"
        title="At-Risk Alert"
        message="9 students need immediate academic follow-up based on current performance indicators."
        actionLabel="Review Students"
        actionTo="/faculty/student-overview"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Total Students" value="420" tone="primary" />
        <DashboardCard title="Total Subjects" value="18" tone="secondary" />
        <DashboardCard title="At-Risk Students" value="49" tone="success" />
      </div>
    </div>
  )
}

export default FacultyDashboard