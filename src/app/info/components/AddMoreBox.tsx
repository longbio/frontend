import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface AddMoreBoxProps {
  options: string[]
  setOptions: (opts: string[]) => void
  placeholder?: string
}

export default function AddMoreBox({
  options,
  setOptions,
  placeholder = 'Add your own...',
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

  return (
    <>
      <div className="flex items-center h-9 mt-7 gap-2">
        <button
          type="button"
          className="flex items-center justify-center text-purple-blaze text-sm hover:text-purple-blaze/70 transition gap-x-1"
          onClick={() => setShowInput((prev) => !prev)}
          aria-label="Add custom option"
        >
          <Plus className="size-4" />
          <span className="text-nowrap">
            {options.length === 0 ? 'Add University' : 'Add More'}
          </span>
        </button>
        {showInput && (
          <input
            type="text"
            className="border rounded-full px-3 py-1 ml-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze"
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
            className="px-3 py-1 rounded-full bg-purple-blaze text-white text-xs font-bold"
            onClick={handleAdd}
          >
            Add
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span
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
          </span>
        ))}
      </div>
    </>
  )
}
