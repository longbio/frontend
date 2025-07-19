import { Plus, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useUniversities } from '@/service/university/hook'

interface AddMoreBoxProps {
  options: string[]
  setOptions: (opts: string[]) => void
  placeholder?: string
  buttonLabel?: string
  staticOptions?: string[]
}

export default function AddMoreBox({
  options,
  setOptions,
  placeholder = 'Add your own...',
  buttonLabel,
  staticOptions,
}: AddMoreBoxProps) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')

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

  return (
    <>
      <div className="flex flex-wrap items-center h-9 my-3.5 xl:my-0 gap-2 max-w-full">
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
          <input
            type="text"
            className="min-w-0 flex-1 border rounded-full px-3 py-1 md:ml-2 text-[11px] md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            autoFocus
          />
        )}
        {showInput && (
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-purple-blaze text-white text-[10px] md:text-xs font-bold"
            onClick={handleAdd}
          >
            Add
          </button>
        )}
        {showInput && staticOptions && staticOptions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto min-w-[180px]">
            {staticOptions
              .filter((opt) => !options.includes(opt))
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
}: {
  universities: string[]
  setUniversities: (opts: string[]) => void
  placeholder?: string
}) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputBoxRef = useRef<HTMLDivElement>(null)
  const { names, isLoading } = useUniversities()

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

  const filteredSuggestions =
    inputValue.length > 0
      ? names.filter(
          (u) => u.toLowerCase().includes(inputValue.toLowerCase()) && !universities.includes(u)
        )
      : names.filter((u) => !universities.includes(u))

  useEffect(() => {
    if (!showInput) return
    const handleClickOutside = (event: MouseEvent) => {
      if (inputBoxRef.current && !inputBoxRef.current.contains(event.target as Node)) {
        setShowInput(false)
        setInputValue('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInput])

  return (
    <>
      <div className="flex flex-wrap items-center h-9 gap-2 max-w-full">
        <button
          type="button"
          className="flex items-center justify-center text-purple-blaze text-sm hover:text-purple-blaze/70 transition gap-x-1"
          onClick={handleToggleInput}
          aria-label="Add university"
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {universities.length === 0 ? 'Add University' : 'Add More'}
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
                autoFocus
                disabled={isLoading}
              />

              {!isLoading && filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredSuggestions.map((s: string, idx: number) => (
                    <li
                      key={s + '-' + idx}
                      className="px-3 py-1 hover:bg-purple-100 cursor-pointer text-sm"
                      onClick={() => handleAdd(s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-purple-blaze text-white text-[10px] md:text-xs font-bold"
              onClick={() => handleAdd(inputValue)}
            >
              Add
            </button>
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
