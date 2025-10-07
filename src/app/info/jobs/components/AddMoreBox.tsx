'use client'
import { Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'

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
