'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { countryDialCodes, type CountryDialCode, defaultCountry } from '@/utils/countryDialCodes'
import clsx from 'clsx'

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string
  error?: boolean
  labelClassName?: string
  value?: string
  onChange?: (value: string) => void
  countryCode?: string
  onCountryCodeChange?: (dialCode: string) => void
}

export function PhoneInput({
  label,
  error,
  className,
  labelClassName,
  value = '',
  onChange,
  countryCode,
  onCountryCodeChange,
  ...props
}: PhoneInputProps) {
  // Helper function to create unique value from country
  const getCountryValue = (country: CountryDialCode) => `${country.dialCode}-${country.code}`
  
  // Helper function to parse value back to dialCode
  const parseDialCodeFromValue = (value: string) => value.split('-')[0]

  const [selectedCountry, setSelectedCountry] = React.useState<CountryDialCode>(() => {
    if (countryCode) {
      // Prefer US when dialCode is +1
      const country = countryCode === '+1' 
        ? countryDialCodes.find((c) => c.code === 'US') || countryDialCodes.find((c) => c.dialCode === countryCode)
        : countryDialCodes.find((c) => c.dialCode === countryCode)
      return country || defaultCountry
    }
    return defaultCountry
  })

  const [phoneNumber, setPhoneNumber] = React.useState(value)

  React.useEffect(() => {
    setPhoneNumber(value)
  }, [value])

  React.useEffect(() => {
    if (countryCode) {
      // Prefer US when dialCode is +1
      const country = countryCode === '+1'
        ? countryDialCodes.find((c) => c.code === 'US') || countryDialCodes.find((c) => c.dialCode === countryCode)
        : countryDialCodes.find((c) => c.dialCode === countryCode)
      if (country) {
        setSelectedCountry(country)
      }
    }
  }, [countryCode])

  const handleCountryChange = (value: string) => {
    const dialCode = parseDialCodeFromValue(value)
    // First try to find by the unique value (dialCode-code combination)
    let country = countryDialCodes.find((c) => getCountryValue(c) === value)
    
    // If not found and dialCode is +1, prefer US
    if (!country && dialCode === '+1') {
      country = countryDialCodes.find((c) => c.code === 'US')
    }
    
    // Fallback to any country with matching dialCode
    if (!country) {
      country = countryDialCodes.find((c) => c.dialCode === dialCode)
    }
    
    if (country) {
      setSelectedCountry(country)
      onCountryCodeChange?.(country.dialCode)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '') // Only allow digits
    setPhoneNumber(newValue)
    onChange?.(newValue)
  }

  const fullPhoneNumber = selectedCountry.dialCode + phoneNumber

  return (
    <div className="w-full">
      <label htmlFor={props.id} className={clsx('text-lg font-semibold text-black block mb-3', labelClassName)}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Country Code Selector */}
        <Select value={getCountryValue(selectedCountry)} onValueChange={handleCountryChange}>
          <SelectTrigger
            className={clsx(
              'w-fit min-w-[110px] h-9 rounded-[100px] border-black bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
              'focus-visible:border-ring focus-visible:ring-ring/50',
              error && 'border-red-500 focus-visible:ring-red-500/50',
              'flex items-center justify-between gap-1.5'
            )}
          >
            <SelectValue>
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{selectedCountry.emoji}</span>
                <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {countryDialCodes.map((country) => (
              <SelectItem key={country.code} value={getCountryValue(country)}>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-base leading-none">{country.emoji}</span>
                  <span className="text-sm flex-1">{country.name}</span>
                  <span className="text-sm text-gray-500">{country.dialCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="1234567890"
          className={clsx(
            'flex-1',
            error && 'border-red-500 focus-visible:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {/* Hidden input for form integration (contains full phone number with country code) */}
      <input type="hidden" value={fullPhoneNumber} />
    </div>
  )
}

