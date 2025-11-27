import React from 'react'
import DatePicker from '@/app/info/components/DataPicker'

interface GraduationYearBoxProps {
  graduationYear: string | null
  setGraduationYear: (year: string | null) => void
  minYear?: number
  maxYear?: number
  className?: string
}

const GraduationYearBox: React.FC<GraduationYearBoxProps> = ({
  graduationYear,
  setGraduationYear,
  minYear = 1950,
  maxYear = 2030,
  className = '',
}) => {
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString())
  const selected = { year: graduationYear || '' }
  const setSelected = (val: Record<string, string>) => {
    setGraduationYear(val.year)
  }

  const triggerClassNames = {
    year:
      'border rounded-full h-7 text-xs focus:outline-none focus:ring-2 focus:ring-purple-blaze w-28 ' +
      (!graduationYear ? 'text-gray-400 ' : ''),
  }
  const labels = {
    year: 'Exp: 2023',
  }

  return (
    <div className={`flex flex-col gap-2 my-4 ${className}`}>
      <label className="text-sm font-medium mx-1.5">Graduation Year</label>
      <DatePicker
        pickers={{ year: years }}
        selected={selected}
        setSelected={setSelected}
        triggerClassNames={triggerClassNames}
        labels={labels}
        confirmText={() => null}
      />
    </div>
  )
}

export default GraduationYearBox
