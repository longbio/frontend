'use client'
import { Plus, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useJobPositions } from '@/service/jobs/hook'

interface AddMoreBoxProps {
  options: string[]
  setOptions: (options: string[]) => void
  placeholder?: string
  buttonLabel?: string
  staticOptions?: string[]
  disabled?: boolean
}

export default function AddMoreBox({
  options,
  setOptions,
  placeholder = 'Add your own...',
  buttonLabel,
  staticOptions,
  disabled = false,
}: AddMoreBoxProps) {
  const [showInput, setShowInput] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim() && !options.includes(inputValue.trim())) {
      setOptions([...options, inputValue.trim()])
      setInputValue('')
      setShowInput(false)
      setShowDropdown(false)
    }
  }

  const handleStaticClick = (item: string) => {
    if (!options.includes(item)) {
      setOptions([...options, item])
      setShowInput(false)
      setShowDropdown(false)
    }
  }

  const handleRemove = (option: string) => {
    setOptions(options.filter((o) => o !== option))
  }

  useEffect(() => {
    if (!showInput) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const currentContainer = document.querySelector(
        `[data-container-id="${buttonLabel || 'default'}"]`
      )
      if (currentContainer && !currentContainer.contains(target)) {
        setShowInput(false)
        setShowDropdown(false)
        setInputValue('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInput, buttonLabel])

  useEffect(() => {
    if (showInput) {
      if (staticOptions && staticOptions.length > 0) {
        setShowDropdown(true)
      }

      const otherDropdowns = document.querySelectorAll('.add-more-container')
      otherDropdowns.forEach((container) => {
        if (!container.classList.contains('add-more-container')) {
          const input = container.querySelector('input')
          if (input) {
            input.blur()
          }
        }
      })
    }
  }, [showInput, staticOptions])

  return (
    <>
      <div
        className="flex flex-wrap items-center h-9 mt-3.5 xl:my-0 gap-2 max-w-full relative add-more-container"
        data-container-id={buttonLabel || 'default'}
      >
        <button
          type="button"
          className={`flex items-center justify-center text-sm transition gap-x-1 ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-purple-blaze hover:text-purple-blaze/70'
          }`}
          onClick={disabled ? undefined : () => setShowInput((prev) => !prev)}
          aria-label={buttonLabel || 'Add custom option'}
          disabled={disabled}
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {disabled
              ? 'Select position first'
              : buttonLabel
              ? buttonLabel
              : options.length === 0
              ? 'Add Position'
              : 'Add More'}
          </span>
        </button>
        {showInput && (
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full border rounded-full px-3 py-1 text-[11px] md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd()
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (staticOptions && staticOptions.length > 0) {
                    setShowDropdown(!showDropdown)
                  }
                }}
                autoFocus
              />
              {staticOptions && staticOptions.length > 0 && showDropdown && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
                  {staticOptions
                    .filter((opt) => !options.includes(opt))
                    .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
                    .map((opt) => (
                      <li
                        key={opt}
                        className="px-3 py-1 hover:bg-purple-100 cursor-pointer text-sm"
                        onClick={() => handleStaticClick(opt)}
                      >
                        {opt}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div
            key={option}
            className="flex items-center border-2 border-purple-blaze rounded-full px-3 py-1 text-sm font-light bg-white text-black"
          >
            {option}
            <button
              type="button"
              className="ml-2 p-0.5 rounded-full hover:bg-purple-100"
              onClick={() => handleRemove(option)}
              aria-label={`Remove ${option}`}
            >
              <X className="size-4 text-purple-300" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export function AddCompanyBox({
  companies,
  setCompanies,
  placeholder = 'Add your company...',
  disabled = false,
  selectedPositions = [],
}: {
  companies: string[]
  setCompanies: (opts: string[]) => void
  placeholder?: string
  disabled?: boolean
  selectedPositions?: string[]
}) {
  const [showInput, setShowInput] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { data: jobPositions, loading: isLoading } = useJobPositions()

  const handleAdd = (value: string) => {
    if (value.trim() && !companies.includes(value.trim())) {
      setCompanies([...companies, value.trim()])
      setInputValue('')
      setShowInput(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleToggleInput = () => {
    setShowInput((prev) => {
      const next = !prev
      if (!next) {
        setInputValue('')
      }
      return next
    })
  }

  // Get all companies from all positions
  const allCompanies = useMemo(() => {
    const companySet = new Set<string>()
    jobPositions.forEach((position) => {
      position.companies.forEach((company) => companySet.add(company))
    })
    return Array.from(companySet)
  }, [jobPositions])

  // Get companies related to selected positions
  const relatedCompanies = useMemo(() => {
    if (selectedPositions.length === 0) return []
    
    const companySet = new Set<string>()
    selectedPositions.forEach((positionName) => {
      const position = jobPositions.find((p) => p.name === positionName)
      if (position) {
        position.companies.forEach((company) => companySet.add(company))
      }
    })
    return Array.from(companySet)
  }, [selectedPositions, jobPositions])

  const filteredSuggestions = useMemo(() => {
    const suggestions = inputValue.length > 0
      ? allCompanies.filter(
          (c) => c.toLowerCase().includes(inputValue.toLowerCase()) && !companies.includes(c)
        )
      : allCompanies.filter((c) => !companies.includes(c))
    return suggestions
  }, [inputValue, allCompanies, companies])

  useEffect(() => {
    if (!showInput) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const container = document.querySelector('.company-container')
      if (container && !container.contains(target)) {
        setShowInput(false)
        setShowDropdown(false)
        setInputValue('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInput])

  // Close other dropdowns when this one opens
  useEffect(() => {
    if (showInput) {
      // Show dropdown by default when input opens
      if (filteredSuggestions.length > 0 || inputValue.trim()) {
        setShowDropdown(true)
      }

      // Close all other dropdowns
      const otherDropdowns = document.querySelectorAll('.add-more-container, .company-container')
      otherDropdowns.forEach((container) => {
        if (!container.classList.contains('company-container')) {
          const input = container.querySelector('input')
          if (input) {
            input.blur()
          }
        }
      })
    }
  }, [showInput, filteredSuggestions, inputValue])

  return (
    <>
      <div className="flex flex-wrap items-center h-9 gap-2 max-w-full company-container">
        <button
          type="button"
          className={`flex items-center justify-center text-sm transition gap-x-1 ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-purple-blaze hover:text-purple-blaze/70'
          }`}
          onClick={disabled ? undefined : handleToggleInput}
          aria-label="Add company"
          disabled={disabled}
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {disabled
              ? 'Select position first'
              : companies.length === 0
              ? 'Add Company'
              : 'Add More'}
          </span>
        </button>
        {showInput && (
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full">
              <input
                type="text"
                className={`w-full border rounded-full px-3 py-1 text-[11px] md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze${
                  isLoading ? ' opacity-50' : ''
                }`}
                placeholder={isLoading ? 'Loading...' : placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd(inputValue)
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Toggle dropdown when clicking on input
                  if (filteredSuggestions.length > 0 || inputValue.trim()) {
                    setShowDropdown(!showDropdown)
                  }
                }}
                autoFocus
                disabled={isLoading}
              />

              {!isLoading &&
                (filteredSuggestions.length > 0 || inputValue.trim()) &&
                showDropdown && (
                  <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
                    {relatedCompanies.length > 0 && (
                      <li className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Related to your positions:
                      </li>
                    )}
                    {filteredSuggestions
                      .filter((s) => relatedCompanies.includes(s))
                      .map((s: string, idx: number) => (
                        <li
                          key={s + '-related-' + idx}
                          className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm bg-white"
                          onClick={() => handleAdd(s)}
                        >
                          {s}
                        </li>
                      ))}
                    {filteredSuggestions.filter((s) => !relatedCompanies.includes(s)).length >
                      0 && (
                      <li className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Other companies:
                      </li>
                    )}
                    {filteredSuggestions
                      .filter((s) => !relatedCompanies.includes(s))
                      .map((s: string, idx: number) => (
                        <li
                          key={s + '-other-' + idx}
                          className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm bg-white"
                          onClick={() => handleAdd(s)}
                        >
                          {s}
                        </li>
                      ))}
                    {/* Add "Other" option for custom input */}
                    {inputValue.trim() && !filteredSuggestions.includes(inputValue.trim()) && (
                      <>
                        <li className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                          Custom:
                        </li>
                        <li
                          className="px-3 py-1 hover:bg-green-100 cursor-pointer text-sm bg-green-50 border-l-4 border-green-400"
                          onClick={() => handleAdd(inputValue.trim())}
                        >
                          Add &quot;{inputValue.trim()}&quot; as custom company
                        </li>
                      </>
                    )}
                  </ul>
                )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-1.5">
        {(companies as string[]).map((company: string, idx: number) => (
          <div
            key={company + '-' + idx}
            className="flex items-center border-2 border-gray-300 rounded-full px-3 py-1 text-nowrap text-xs md:text-sm font-light bg-white text-black"
          >
            <span title={company} className="truncate w-52">
              {company}
            </span>
            <button
              type="button"
              className="ml-2 p-0.5 rounded-full hover:bg-gray-100"
              onClick={() => setCompanies(companies.filter((c) => c !== company))}
              aria-label={`Remove ${company}`}
            >
              <X className="size-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
