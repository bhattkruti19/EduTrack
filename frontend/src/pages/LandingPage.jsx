import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

const roles = [
  {
    key: 'student',
    title: 'Student',
    description: 'Track attendance, monitor performance, and predict CGPA quickly.',
    bg: 'from-edu-teal to-edu-mint',
  },
  {
    key: 'faculty',
    title: 'Faculty',
    description: 'Analyze class trends, identify at-risk students, and monitor risk predictions.',
    bg: 'from-edu-navy to-edu-blue',
  },
  {
    key: 'counsellor',
    title: 'Counsellor',
    description: 'Add students, manage counsellor assignments, and support at-risk learners.',
    bg: 'from-edu-blue to-edu-teal',
  },
]

function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <section className="rounded-soft bg-white p-6 text-center shadow-soft sm:p-10">
        <BrandLogo className="mx-auto" imageClassName="mx-auto h-36 w-auto sm:h-44" priority />
        <h1 className="text-3xl font-bold text-edu-navy sm:text-4xl">
          EduTrack – Smart Academic Performance & Engagement Tracking System
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-edu-blue sm:text-base">
          Choose your role to continue. This demo includes UI-only Sign In and Sign Up pages without
          authentication.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {roles.map((role) => (
          <div key={role.key} className="rounded-soft bg-white p-5 shadow-soft sm:p-6">
            <div className={`rounded-xl bg-gradient-to-r p-4 text-white ${role.bg}`}>
              <h2 className="text-2xl font-bold">{role.title}</h2>
              <p className="mt-2 text-sm text-white/85">{role.description}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/${role.key}/login`}
                className="rounded-lg bg-edu-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-edu-blue"
              >
                Sign In
              </Link>
              <Link
                to={`/${role.key}/signup`}
                className="rounded-lg border border-edu-blue/20 bg-edu-bg px-4 py-2 text-sm font-medium text-edu-navy transition hover:border-edu-teal"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default LandingPage