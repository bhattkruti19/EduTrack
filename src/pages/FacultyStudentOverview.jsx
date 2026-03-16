import { useMemo, useState } from 'react'
import AlertBanner from '../components/AlertBanner'
import FilterBar from '../components/FilterBar'

const overviewRows = [
  {
    name: 'Aarav Shah',
    branch: 'Computer Engineering',
    subject: 'Data Structures',
    semester: 'Sem 6',
    risk: 'Medium',
    updatedAt: '2026-03-14',
  },
  {
    name: 'Nisha Patel',
    branch: 'Information Technology',
    subject: 'DBMS',
    semester: 'Sem 6',
    risk: 'Low',
    updatedAt: '2026-03-10',
  },
  {
    name: 'Rohan Desai',
    branch: 'Computer Engineering',
    subject: 'Operating Systems',
    semester: 'Sem 4',
    risk: 'High',
    updatedAt: '2026-03-16',
  },
  {
    name: 'Meera Joshi',
    branch: 'Electronics',
    subject: 'Computer Networks',
    semester: 'Sem 5',
    risk: 'Medium',
    updatedAt: '2026-03-12',
  },
  {
    name: 'Dhruv Parmar',
    branch: 'Information Technology',
    subject: 'Data Structures',
    semester: 'Sem 5',
    risk: 'High',
    updatedAt: '2026-03-15',
  },
]

function FacultyStudentOverview() {
  const [filters, setFilters] = useState({
    branch: '',
    subject: '',
    semester: '',
    search: '',
    sort: 'latest',
  })

  const branchOptions = useMemo(
    () => [...new Set(overviewRows.map((row) => row.branch))],
    [],
  )
  const subjectOptions = useMemo(
    () => [...new Set(overviewRows.map((row) => row.subject))],
    [],
  )
  const semesterOptions = useMemo(
    () => [...new Set(overviewRows.map((row) => row.semester))],
    [],
  )

  const filteredRows = useMemo(() => {
    const riskRank = {
      High: 3,
      Medium: 2,
      Low: 1,
    }
    const searchText = filters.search.trim().toLowerCase()

    const rows = overviewRows.filter((row) => {
      const matchesBranch = !filters.branch || row.branch === filters.branch
      const matchesSubject = !filters.subject || row.subject === filters.subject
      const matchesSemester = !filters.semester || row.semester === filters.semester
      const matchesSearch =
        !searchText ||
        row.name.toLowerCase().includes(searchText) ||
        row.subject.toLowerCase().includes(searchText) ||
        row.branch.toLowerCase().includes(searchText)

      return matchesBranch && matchesSubject && matchesSemester && matchesSearch
    })

    return rows.sort((first, second) => {
      if (filters.sort === 'highest-risk') {
        return riskRank[second.risk] - riskRank[first.risk]
      }
      if (filters.sort === 'lowest-risk') {
        return riskRank[first.risk] - riskRank[second.risk]
      }
      return new Date(second.updatedAt) - new Date(first.updatedAt)
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-edu-navy">Student Overview</h1>
        <p className="text-sm text-edu-blue">
          Review branch, semester, and risk-level trends using filters.
        </p>
      </div>

      <AlertBanner
        tone="attention"
        title="Monitoring Alert"
        message="Use branch + semester filters to prioritize students with High risk before upcoming internal assessments."
      />

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        branchOptions={branchOptions}
        subjectOptions={subjectOptions}
        semesterOptions={semesterOptions}
      />

      <section className="overflow-x-auto rounded-soft bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-edu-navy">Overview Results</h2>
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-edu-blue/15 text-edu-navy">
              <th className="py-3 font-semibold">Student Name</th>
              <th className="py-3 font-semibold">Branch</th>
              <th className="py-3 font-semibold">Subject</th>
              <th className="py-3 font-semibold">Semester</th>
              <th className="py-3 font-semibold">Risk Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.name} className="border-b border-edu-blue/10">
                <td className="py-3 font-medium text-edu-navy">{row.name}</td>
                <td className="py-3 text-edu-blue">{row.branch}</td>
                <td className="py-3 text-edu-blue">{row.subject}</td>
                <td className="py-3 text-edu-blue">{row.semester}</td>
                <td className="py-3">
                  <span className="rounded-full bg-edu-sand/55 px-2.5 py-1 text-xs font-medium text-edu-navy">
                    {row.risk}
                  </span>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-sm text-edu-blue">
                  No students match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default FacultyStudentOverview