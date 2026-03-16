import { useMemo, useState } from 'react'
import AlertBanner from '../components/AlertBanner'

const subjects = ['Data Structures', 'DBMS', 'Operating Systems', 'Networks', 'Mathematics']

function PredictCGPA() {
  const [marks, setMarks] = useState([0, 0, 0, 0, 0])
  const [predicted, setPredicted] = useState(null)

  const isValid = useMemo(() => marks.every((mark) => mark >= 0 && mark <= 100), [marks])

  const updateMark = (index, value) => {
    const nextMarks = [...marks]
    nextMarks[index] = Number(value)
    setMarks(nextMarks)
  }

  const handlePredict = () => {
    if (!isValid) return
    const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length
    const cgpa = (average / 9.5).toFixed(2)
    setPredicted(cgpa)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-edu-navy">Predict CGPA</h1>
        <p className="text-sm text-edu-blue">Enter expected marks to estimate your CGPA.</p>
      </div>

      <AlertBanner
        tone="info"
        title="Prediction Alert"
        message="CGPA prediction is an estimate based on entered marks. Use realistic values for better guidance."
      />

      <section className="rounded-soft bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold text-edu-navy">Marks Input</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {subjects.map((subject, index) => (
            <label key={subject} className="space-y-1">
              <span className="text-sm font-medium text-edu-navy">{subject}</span>
              <input
                type="number"
                min="0"
                max="100"
                value={marks[index]}
                onChange={(event) => updateMark(index, event.target.value)}
                className="w-full rounded-lg border border-edu-blue/20 px-3 py-2 text-sm outline-none transition focus:border-edu-teal focus:ring-2 focus:ring-edu-teal/25"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePredict}
          disabled={!isValid}
          className="mt-5 rounded-lg bg-edu-teal px-5 py-2.5 font-medium text-white transition hover:bg-edu-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          Predict CGPA
        </button>
      </section>

      <section className="rounded-soft bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-edu-navy">Prediction Result</h2>
        <p className="mt-2 text-sm text-edu-blue">Predicted CGPA based on entered marks:</p>
        <div className="mt-3 inline-flex items-center rounded-xl bg-edu-mint/40 px-4 py-2">
          <span className="text-2xl font-bold text-edu-navy">{predicted ?? '--'}</span>
        </div>
      </section>
    </div>
  )
}

export default PredictCGPA