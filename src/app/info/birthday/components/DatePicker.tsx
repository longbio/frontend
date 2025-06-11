'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'

interface DatePickerProps {
  onDateSelect: (date: Date) => void
}

export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setOpen(false)
      onDateSelect(newDate)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-zinc-400 text-xs font-medium bg-cloud-mist border-none justify-center py-5.5 rounded-[100px]"
        >
          {date ? format(date, 'yyyy/MM/dd') : 'Exp: 1996/5/25'}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}
