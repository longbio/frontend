import React from 'react'

interface CalculateAgeProps {
  year: string
  month: string
  day: string
}

function calculateAge(year: string, month: string, day: string): number | null {
  if (!year || !month || !day) return null
  const clean = (val: string) => val.replace(/^Exp:\s*/, '')
  const y = Number(clean(year))
  const m = Number(clean(month))
  const d = Number(clean(day))
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  const birthDate = new Date(y, m - 1, d)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const mDiff = today.getMonth() - birthDate.getMonth()
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const CalculateAge: React.FC<CalculateAgeProps> = ({ year, month, day }) => {
  const age = calculateAge(year, month, day)
  if (
    age === null ||
    year.startsWith('Exp:') ||
    month.startsWith('Exp:') ||
    day.startsWith('Exp:')
  ) {
    return null
  }
  return (
    <div className="flex items-center justify-start mt-4 mx-2 text-sm font-medium text-gray-700">
      <h3>Your age is</h3>
      <h2 className="mx-1 text-gray-400">{age}</h2>
    </div>
  )
}

export default CalculateAge
