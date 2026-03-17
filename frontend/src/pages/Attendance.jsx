import AttendanceTable from '../components/AttendanceTable'

const attendanceData = [
  { subject: 'Data Structures', attended: 32, total: 38, percentage: 84 },
  { subject: 'DBMS', attended: 29, total: 35, percentage: 83 },
  { subject: 'Operating Systems', attended: 31, total: 37, percentage: 84 },
  { subject: 'Computer Networks', attended: 27, total: 33, percentage: 82 },
  { subject: 'Mathematics', attended: 34, total: 40, percentage: 85 },
]

function Attendance() {
  const overallAttendance = Math.round(
    attendanceData.reduce((sum, row) => sum + row.percentage, 0) / attendanceData.length,
  )
  const attendanceTone = overallAttendance >= 85 ? 'success' : 'warning'

  return (
    <div className="space-y-6">
      <div className="rounded-soft bg-white p-4 shadow-soft">
        <p className="text-sm text-edu-blue">Overall Percentage</p>
        <div className="mt-2 flex items-end gap-2">
          <h2 className="text-3xl font-bold text-edu-navy">{overallAttendance}%</h2>
          <span className="mb-1 rounded-full bg-edu-blue/12 px-2 py-1 text-xs text-edu-navy">Good Standing</span>
        </div>
      </div>

      <AttendanceTable data={attendanceData} />
    </div>
  )
}

export default Attendance