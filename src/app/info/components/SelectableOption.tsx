import { Checkbox } from '@/components/ui/checkbox'

interface SelectableOptionProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export default function SelectableOption({
  id,
  label,
  checked,
  onCheckedChange,
  className = '',
}: SelectableOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex justify-between items-center bg-cloud-mist px-6 py-2.5 rounded-full ${className}`}
    >
      <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </h2>
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  )
}
