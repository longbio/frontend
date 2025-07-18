import clsx from 'clsx'
import React from 'react'
import { Input } from '@/components/ui/input'

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  className?: string
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ error, className, ...inputProps }, ref) => (
    <div className={className}>
      <Input
        ref={ref}
        aria-invalid={!!error}
        className={clsx(error && 'border-red-500 focus-visible:ring-red-500/50')}
        {...inputProps}
      />
    </div>
  )
)
LabeledInput.displayName = 'LabeledInput'

export default LabeledInput
