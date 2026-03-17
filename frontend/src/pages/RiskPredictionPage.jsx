import { useMemo, useState } from 'react'
import FilterBar from '../components/risk/FilterBar'
import RiskCard from '../components/risk/RiskCard'
import StudentTable from '../components/risk/StudentTable'

const DUMMY_STUDENTS = [
  { id: 101, name: 'Rahul', status: 'High', reason: 'Low attendance', branch: 'CSE', subject: 'DBMS', semester: '5' },
  { id: 102, name: 'Aman', status: 'Medium', reason: 'Low marks', branch: 'CSE', subject: 'Data Structures', semester: '4' },
  { id: 103, name: 'Neha', status: 'Low', reason: 'Good performance', branch: 'IT', subject: 'Operating Systems', semester: '5' },
  { id: 104, name: 'Riya', status: 'High', reason: 'Low assignment scores', branch: 'ECE', subject: 'Mathematics', semester: '3' },
  { id: 105, name: 'Kunal', status: 'Medium', reason: 'Irregular test performance', branch: 'ME', subject: 'Computer Networks', semester: '6' },
]

const RISK_ORDER = { High: 3, Medium: 2, Low: 1 }

const sortOptions = [
  { value: 'risk-desc', label: 'Sorting: High to Low Risk' },
  { value: 'risk-asc', label: 'Sorting: Low to High Risk' },
  { value: 'name-asc', label: 'Sorting: Name A-Z' },
]

function RiskPredictionPage() {
  const [filters, setFilters] = useState({
    branch: '',
    subject: '',
    semester: '',
    sorting: 'risk-desc',
  })
  const [studentData] = useState(DUMMY_STUDENTS)

  const branchOptions = useMemo(
    () => [...new Set(studentData.map((student) => student.branch))],
    [studentData],
  )
  const subjectOptions = useMemo(
    () => [...new Set(studentData.map((student) => student.subject))],
    [studentData],
  )
  const semesterOptions = useMemo(
    () => [...new Set(studentData.map((student) => student.semester))],
    [studentData],
  )

  const filteredStudents = useMemo(() => {
    const next = studentData.filter((student) => {
      if (filters.branch && student.branch !== filters.branch) return false
      if (filters.subject && student.subject !== filters.subject) return false
      if (filters.semester && student.semester !== filters.semester) return false
      return true
    })

    next.sort((a, b) => {
      if (filters.sorting === 'name-asc') return a.name.localeCompare(b.name)
      if (filters.sorting === 'risk-asc') return RISK_ORDER[a.status] - RISK_ORDER[b.status]
      return RISK_ORDER[b.status] - RISK_ORDER[a.status]
    })

    return next
  }, [studentData, filters])

  const riskCounts = useMemo(
    () => ({
      low: filteredStudents.filter((student) => student.status === 'Low').length,
      medium: filteredStudents.filter((student) => student.status === 'Medium').length,
      high: filteredStudents.filter((student) => student.status === 'High').length,
    }),
    [filteredStudents],
  )

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          branchOptions={branchOptions}
          subjectOptions={subjectOptions}
          semesterOptions={semesterOptions}
          sortOptions={sortOptions}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <RiskCard title="Low Risk Students" count={riskCounts.low} tone="low" />
          <RiskCard title="Medium Risk Students" count={riskCounts.medium} tone="medium" />
          <RiskCard title="High Risk Students" count={riskCounts.high} tone="high" />
        </section>

        <StudentTable students={filteredStudents} />
    </div>
  )
}

export default RiskPredictionPage