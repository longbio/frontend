import { Plus, X } from 'lucide-react'
import { useTopics } from '@/service/topics'
import { useState, useEffect, useMemo } from 'react'

interface AddMoreBoxProps {
  options: string[]
  setOptions: (opts: string[]) => void
  placeholder?: string
  buttonLabel?: string
  staticOptions?: string[]
  allUniversities?: string[]
}

export default function AddMoreBox({
  options,
  setOptions,
  placeholder = 'Add your own...',
  buttonLabel,
  staticOptions,
}: AddMoreBoxProps) {
  const [showInput, setShowInput] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { topics } = useTopics()

  const handleAdd = () => {
    if (inputValue.trim() && !options.includes(inputValue.trim())) {
      setOptions([...options, inputValue.trim()])
      setInputValue('')
      setShowInput(false)
    }
  }

  const handleStaticClick = (item: string) => {
    if (!options.includes(item)) {
      setOptions([...options, item])
      setShowInput(false)
    }
  }

  const availableOptions = useMemo(
    () => staticOptions || (buttonLabel?.includes('Topic') ? topics.map((t) => t.id) : []),
    [staticOptions, buttonLabel, topics]
  )

  useEffect(() => {
    if (!showInput) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const container = document.querySelector('.add-more-container')
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

  useEffect(() => {
    if (showInput) {
      // Show dropdown by default when input opens
      if (availableOptions && availableOptions.length > 0) {
        setShowDropdown(true)
      }

      const otherDropdowns = document.querySelectorAll('.add-more-container, .university-container')
      otherDropdowns.forEach((container) => {
        if (!container.classList.contains('add-more-container')) {
          const input = container.querySelector('input')
          if (input) {
            input.blur()
          }
        }
      })
    }
  }, [showInput, availableOptions])

  return (
    <>
      <div className="flex flex-wrap items-center h-9 mt-3.5 xl:my-0 gap-2 max-w-full relative add-more-container">
        <button
          type="button"
          className="flex items-center justify-center text-purple-blaze text-sm hover:text-purple-blaze/70 transition gap-x-1"
          onClick={() => setShowInput((prev) => !prev)}
          aria-label={buttonLabel || 'Add custom option'}
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {buttonLabel ? buttonLabel : options.length === 0 ? 'Add University' : 'Add More'}
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
                  // Toggle dropdown when clicking on input
                  if (availableOptions && availableOptions.length > 0) {
                    setShowDropdown(!showDropdown)
                  }
                }}
                autoFocus
              />
              {availableOptions && availableOptions.length > 0 && showDropdown && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
                  {availableOptions
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
              onClick={() => setOptions(options.filter((o) => o !== option))}
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

export function AddUniversityBox({
  universities,
  setUniversities,
  placeholder = 'Add your university...',
  disabled = false,
  selectedTopics = [],
}: {
  universities: string[]
  setUniversities: (opts: string[]) => void
  placeholder?: string
  disabled?: boolean
  selectedTopics?: string[]
}) {
  const [showInput, setShowInput] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { topics: allTopics, isLoading } = useTopics()

  const handleAdd = (value: string) => {
    if (value.trim() && !universities.includes(value.trim())) {
      setUniversities([...universities, value.trim()])
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

  // Get universities related to selected topics
  const getRelatedUniversities = () => {
    const relatedUnis = new Set<string>()
    selectedTopics.forEach((topicName) => {
      const topic = allTopics.find((t) => t.id === topicName)
      if (topic) {
        topic.universities.forEach((uni) => relatedUnis.add(uni.name))
      }
    })
    return Array.from(relatedUnis)
  }

  // Get all universities from all topics
  const getAllUniversities = () => {
    const allUnis = new Set<string>()
    allTopics.forEach((topic) => {
      topic.universities.forEach((uni) => allUnis.add(uni.name))
    })
    return Array.from(allUnis)
  }

  const relatedUniversities = getRelatedUniversities()
  const allUniversities = getAllUniversities()

  const filteredSuggestions =
    inputValue.length > 0
      ? allUniversities.filter(
          (u) => u.toLowerCase().includes(inputValue.toLowerCase()) && !universities.includes(u)
        )
      : allUniversities.filter((u) => !universities.includes(u))

  useEffect(() => {
    if (!showInput) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const container = document.querySelector('.university-container')
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
      const otherDropdowns = document.querySelectorAll('.add-more-container, .university-container')
      otherDropdowns.forEach((container) => {
        if (!container.classList.contains('university-container')) {
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
      <div className="flex flex-wrap items-center h-9 gap-2 max-w-full university-container">
        <button
          type="button"
          className={`flex items-center justify-center text-sm transition gap-x-1 ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-purple-blaze hover:text-purple-blaze/70'
          }`}
          onClick={disabled ? undefined : handleToggleInput}
          aria-label="Add university"
          disabled={disabled}
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {disabled
              ? 'Select topics first'
              : universities.length === 0
              ? 'Add University'
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
                    {relatedUniversities.length > 0 && (
                      <li className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Related to your topics:
                      </li>
                    )}
                    {filteredSuggestions
                      .filter((s) => relatedUniversities.includes(s))
                      .map((s: string, idx: number) => (
                        <li
                          key={s + '-related-' + idx}
                          className="px-3 py-1 hover:bg-purple-100 cursor-pointer text-sm bg-purple-50"
                          onClick={() => handleAdd(s)}
                        >
                          {s}
                        </li>
                      ))}
                    {filteredSuggestions.filter((s) => !relatedUniversities.includes(s)).length >
                      0 && (
                      <li className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Other universities:
                      </li>
                    )}
                    {filteredSuggestions
                      .filter((s) => !relatedUniversities.includes(s))
                      .map((s: string, idx: number) => (
                        <li
                          key={s + '-other-' + idx}
                          className="px-3 py-1 hover:bg-purple-100 cursor-pointer text-sm"
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
                          Add &quot;{inputValue.trim()}&quot; as custom university
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
        {(universities as string[]).map((university: string, idx: number) => (
          <div
            key={university + '-' + idx}
            className="flex items-center border-2 border-purple-blaze rounded-full px-3 py-1 text-nowrap text-xs md:text-sm font-light bg-white text-black"
          >
            <span title={university} className="truncate w-52">
              {university}
            </span>
            <button
              type="button"
              className="ml-2 p-0.5 rounded-full hover:bg-purple-100"
              onClick={() => setUniversities(universities.filter((u) => u !== university))}
              aria-label={`Remove ${university}`}
            >
              <X className="size-4 text-purple-300" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
