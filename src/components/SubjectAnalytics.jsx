const subjectRiskData = [
  { subject: 'Data Structures', atRisk: 16 },
  { subject: 'DBMS', atRisk: 11 },
  { subject: 'Operating Systems', atRisk: 14 },
  { subject: 'Computer Networks', atRisk: 8 },
  { subject: 'Mathematics', atRisk: 18 },
]

function SubjectAnalytics() {
  const maxRisk = Math.max(...subjectRiskData.map((item) => item.atRisk))

  return (
    <div className="rounded-soft bg-white p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-edu-navy">Subject Analytics</h3>
      <p className="mb-5 text-sm text-edu-blue">Which subject has more at-risk students</p>

      <div className="space-y-4">
        {subjectRiskData.map((item) => (
          <div key={item.subject}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-edu-navy">{item.subject}</span>
              <span className="text-edu-blue">{item.atRisk} students</span>
            </div>
            <div className="h-3 rounded-full bg-edu-sand/45">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-edu-teal to-edu-blue"
                style={{ width: `${(item.atRisk / maxRisk) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubjectAnalytics