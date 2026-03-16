function DashboardCard({ title, value, tone }) {
  const tones = {
    primary: 'bg-gradient-to-br from-edu-navy to-edu-blue text-white border border-white/20',
    secondary: 'bg-gradient-to-br from-edu-teal to-edu-blue text-white border border-white/20',
    success: 'bg-gradient-to-br from-edu-mint to-edu-sage text-edu-navy border border-white/30',
  }

  return (
    <div
      className={`rounded-soft p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,93,135,0.24)] ${tones[tone]}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
    </div>
  )
}

export default DashboardCard