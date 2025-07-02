import React from 'react'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  className?: string
  labelClassName?: string
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, error, className, labelClassName, ...inputProps }, ref) => (
    <div className={className}>
      <label className={`text-xl font-bold block ${labelClassName || ''}`} htmlFor={inputProps.id}>
        {label}
      </label>
      <Input
        ref={ref}
        aria-invalid={!!error}
        className={clsx('mt-6', error && 'border-red-500 focus-visible:ring-red-500/50')}
        {...inputProps}
      />
    </div>
  )
)
LabeledInput.displayName = 'LabeledInput'

export default LabeledInput
