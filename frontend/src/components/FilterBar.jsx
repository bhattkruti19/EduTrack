function FilterBar({ filters, onChange, branchOptions, subjectOptions, semesterOptions }) {
  const inputClass =
    'w-full rounded-lg border border-edu-blue/20 bg-white/90 px-3 py-2 text-sm text-edu-navy outline-none transition focus:border-edu-teal focus:ring-2 focus:ring-edu-teal/25'

  return (
    <div className="grid gap-3 rounded-soft border border-white/60 bg-white/85 p-4 shadow-soft backdrop-blur-sm sm:grid-cols-2 xl:grid-cols-5">
      <select
        className={inputClass}
        value={filters.branch}
        onChange={(event) => onChange('branch', event.target.value)}
      >
        <option value="">Filter by Branch</option>
        {branchOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className={inputClass}
        value={filters.subject}
        onChange={(event) => onChange('subject', event.target.value)}
      >
        <option value="">Filter by Subject</option>
        {subjectOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className={inputClass}
        value={filters.semester}
        onChange={(event) => onChange('semester', event.target.value)}
      >
        <option value="">Filter by Semester</option>
        {semesterOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Search student/subject"
        className={inputClass}
      />

      <select
        className={inputClass}
        value={filters.sort}
        onChange={(event) => onChange('sort', event.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="highest-risk">Highest Risk</option>
        <option value="lowest-risk">Lowest Risk</option>
      </select>
    </div>
  )
}

export default FilterBar