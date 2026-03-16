import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignInPage({ role = 'student' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const roleLabel = role === 'faculty' ? 'Faculty' : 'Student'

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) return
    navigate(`/${role}/dashboard`)
  }

  return (
    <div className="mx-auto max-w-md py-4 sm:py-10">
      <section className="rounded-soft bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-2xl font-bold text-edu-navy">{roleLabel} Sign In</h1>
        <p className="mt-1 text-sm text-edu-blue">UI demo only — no real authentication.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-edu-navy">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-edu-blue/20 px-3 py-2 text-sm outline-none transition focus:border-edu-teal focus:ring-2 focus:ring-edu-teal/25"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-edu-navy">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-edu-blue/20 px-3 py-2 text-sm outline-none transition focus:border-edu-teal focus:ring-2 focus:ring-edu-teal/25"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-edu-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-edu-blue"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-edu-blue">
          New user?{' '}
          <Link to={`/${role}/signup`} className="font-semibold text-edu-navy hover:underline">
            Sign Up
          </Link>
        </p>
        <Link to="/" className="mt-2 inline-block text-sm font-medium text-edu-navy hover:underline">
          Back to Landing
        </Link>
      </section>
    </div>
  )
}

export default SignInPage