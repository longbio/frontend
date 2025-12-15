'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { countryDialCodes, type CountryDialCode, defaultCountry } from '@/utils/countryDialCodes'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'
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
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const searchInputRef = React.useRef<HTMLInputElement>(null)

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

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return countryDialCodes
    const query = searchQuery.toLowerCase().trim()
    return countryDialCodes.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
    )
  }, [searchQuery])

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

  // Focus search input when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    } else {
      setSearchQuery('')
    }
  }, [open])

  const handleCountrySelect = (country: CountryDialCode) => {
    setSelectedCountry(country)
    onCountryCodeChange?.(country.dialCode)
    setOpen(false)
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={clsx(
                'w-fit min-w-[110px] h-9 rounded-[100px] border border-black bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
                'focus-visible:border-ring focus-visible:ring-ring/50',
                error && 'border-red-500 focus-visible:ring-red-500/50',
                'flex items-center justify-between gap-1.5'
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{selectedCountry.emoji}</span>
                <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              </div>
              <ChevronDownIcon className="size-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[280px] p-0" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Search Input */}
            <div className="flex items-center border-b px-3 py-2">
              <SearchIcon className="size-4 text-muted-foreground mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            {/* Country List */}
            <div className="max-h-[250px] overflow-y-auto p-1">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No country found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={clsx(
                      'flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors',
                      selectedCountry.code === country.code && 'bg-accent'
                    )}
                  >
                    <span className="text-base leading-none">{country.emoji}</span>
                    <span className="flex-1 text-left truncate">{country.name}</span>
                    <span className="text-muted-foreground shrink-0">{country.dialCode}</span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

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

