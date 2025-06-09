import * as React from 'react'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  labelClassName?: string
}

export function FormInput({ label, error, className, labelClassName, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={props.id} className={clsx('text-xl font-bold', labelClassName)}>
        {label}
      </label>
      <Input
        className={clsx(
          'w-full mt-6',
          error && 'border-red-500 focus-visible:ring-red-500/50',
          className
        )}
        {...props}
      />
    </div>
  )
}
