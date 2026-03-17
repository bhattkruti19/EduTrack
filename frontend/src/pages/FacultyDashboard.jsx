import { useMemo, useState } from 'react'
import DashboardCard from '../components/DashboardCard'
import FilterBar from '../components/FilterBar'
import SubjectAnalytics from '../components/SubjectAnalytics'
import RiskPieChart from '../components/RiskPieChart'

const STUDENTS = [
  {
    name: 'Rahul Sharma',
    branch: 'CSE',
    semester: 5,
    subject: 'Data Structures',
    attendance: 72,
    assignmentMarks: 66,
    labMarks: 61,
    examMarks: 59,
    quizMarks: 64,
    status: 'At Risk',
  },
  {
    name: 'Aman Patel',
    branch: 'IT',
    semester: 4,
    subject: 'DBMS',
    attendance: 85,
    assignmentMarks: 81,
    labMarks: 84,
    examMarks: 78,
    quizMarks: 82,
    status: 'Normal',
  },
  {
    name: 'Priya Mehta',
    branch: 'CSE',
    semester: 5,
    subject: 'Operating Systems',
    attendance: 65,
    assignmentMarks: 63,
    labMarks: 60,
    examMarks: 58,
    quizMarks: 62,
    status: 'At Risk',
  },
  {
    name: 'Sneha Joshi',
    branch: 'ECE',
    semester: 3,
    subject: 'Mathematics',
    attendance: 91,
    assignmentMarks: 89,
    labMarks: 87,
    examMarks: 90,
    quizMarks: 88,
    status: 'Normal',
  },
  {
    name: 'Rohan Gupta',
    branch: 'ME',
    semester: 6,
    subject: 'Computer Networks',
    attendance: 70,
    assignmentMarks: 67,
    labMarks: 69,
    examMarks: 65,
    quizMarks: 66,
    status: 'At Risk',
  },
  {
    name: 'Kavya Singh',
    branch: 'IT',
    semester: 4,
    subject: 'DBMS',
    attendance: 88,
    assignmentMarks: 86,
    labMarks: 83,
    examMarks: 85,
    quizMarks: 84,
    status: 'Normal',
  },
  {
    name: 'Arjun Nair',
    branch: 'CSE',
    semester: 5,
    subject: 'Data Structures',
    attendance: 58,
    assignmentMarks: 54,
    labMarks: 57,
    examMarks: 52,
    quizMarks: 56,
    status: 'At Risk',
  },
  {
    name: 'Divya Rao',
    branch: 'ECE',
    semester: 3,
    subject: 'Mathematics',
    attendance: 92,
    assignmentMarks: 90,
    labMarks: 91,
    examMarks: 89,
    quizMarks: 90,
    status: 'Normal',
  },
]

const BRANCH_OPTIONS   = ['CSE', 'IT', 'ECE', 'ME']
const SUBJECT_OPTIONS  = ['Data Structures', 'DBMS', 'Operating Systems', 'Mathematics', 'Computer Networks']
const SEMESTER_OPTIONS = ['3', '4', '5', '6']

function FacultyDashboard() {
  const [filters, setFilters] = useState({
    branch: '', subject: '', semester: '',
  })
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState({
    branch: '', subject: '', semester: '',
  })

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const canApply = Boolean(filters.branch && filters.subject && filters.semester)

  const handleApplyFilters = () => {
    if (!canApply) return
    setAppliedFilters(filters)
    setHasAppliedFilters(true)
  }

  const atRiskCount = STUDENTS.filter((s) => s.status === 'At Risk').length

  const filtered = STUDENTS.filter((s) => {
    if (appliedFilters.branch && s.branch !== appliedFilters.branch) return false
    if (appliedFilters.subject && s.subject !== appliedFilters.subject) return false
    if (appliedFilters.semester && String(s.semester) !== appliedFilters.semester) return false
    return true
  })

  const fallbackFiltered = STUDENTS.filter((s) => {
    if (appliedFilters.branch && s.branch !== appliedFilters.branch) return false
    if (appliedFilters.semester && String(s.semester) !== appliedFilters.semester) return false
    return true
  })

  const subjectSemesterFallback = STUDENTS.filter((s) => {
    if (appliedFilters.subject && s.subject !== appliedFilters.subject) return false
    if (appliedFilters.semester && String(s.semester) !== appliedFilters.semester) return false
    return true
  })

  const studentsForOutput =
    filtered.length > 0
      ? filtered
      : fallbackFiltered.length > 0
      ? fallbackFiltered
      : subjectSemesterFallback.length > 0
      ? subjectSemesterFallback
      : STUDENTS

  const fallbackMessage =
    filtered.length > 0
      ? ''
      : fallbackFiltered.length > 0
      ? 'No exact match for selected subject. Showing data for selected branch and semester.'
      : subjectSemesterFallback.length > 0
      ? 'No exact match for selected branch. Showing data for selected subject and semester.'
      : 'No exact match found. Showing overall class performance data.'

  const facultyName = useMemo(() => {
    try {
      const storedProfile = localStorage.getItem('edutrack_faculty_profile')
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile)
        if (parsed?.name && parsed.name.trim()) {
          return parsed.name.trim()
        }
      }
    } catch {
    }
    return 'Kruti Bhatt'
  }, [])

  return (
    <div className="space-y-6">
      <section className="rounded-soft bg-gradient-to-r from-edu-teal to-edu-mint p-5 text-edu-navy shadow-soft">
        <h1 className="text-2xl font-bold">Welcome, {facultyName}</h1>
        <p className="mt-1 text-sm text-edu-navy/80">
          Monitor student performance, attendance, and risk predictions from your dashboard.
        </p>
      </section>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard title="Total Students"   value="420"              tone="primary"   />
        <DashboardCard title="Total Subjects"   value="18"               tone="secondary" />
        <DashboardCard title="At-Risk Students" value={String(atRiskCount)} tone="success" />
      </div>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        canApply={canApply}
        branchOptions={BRANCH_OPTIONS}
        subjectOptions={SUBJECT_OPTIONS}
        semesterOptions={SEMESTER_OPTIONS}
      />

      {/* Filtered output */}
      {!hasAppliedFilters ? (
        <div className="rounded-2xl border border-dashed border-edu-blue/35 bg-white/60 p-8 text-center shadow-sm">
          <p className="text-sm text-edu-blue">
            Select Branch, Subject, and Semester, then click Filter to view the output.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fallbackMessage && (
            <div className="rounded-xl border border-edu-sand bg-edu-sand/45 px-4 py-2 text-sm text-edu-navy">
              {fallbackMessage}
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <SubjectAnalytics students={studentsForOutput} />
            </div>
            <div>
              <RiskPieChart students={studentsForOutput} subjectName={appliedFilters.subject} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyDashboard
