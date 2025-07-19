import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { useSports } from '@/service/sport/hook'

interface SportAddButtonProps {
  options: string[]
  setOptions: (opts: string[]) => void
  placeholder?: string
}

export default function SportAddButton({
  options,
  setOptions,
  placeholder = 'Add your own sport...',
}: SportAddButtonProps) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { sports: apiSports, loading } = useSports()
  const sportNames = apiSports.map((s) => s.strSport)

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed])
      setInputValue('')
      setShowInput(false)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (sportName: string) => {
    if (!options.includes(sportName)) {
      setOptions([...options, sportName])
    }
    setInputValue('')
    setShowInput(false)
    setShowSuggestions(false)
  }

  const filteredSuggestions = sportNames.filter(
    (name) => name.toLowerCase().includes(inputValue.toLowerCase()) && !options.includes(name)
  )

  return (
    <div className="flex flex-wrap max-w-full items-center gap-2 relative">
      <Toggle
        pressed={showInput}
        onPressedChange={() => {
          setShowInput((prev) => !prev)
          if (!showInput) setShowSuggestions(false)
        }}
        className="data-[state=on]:bg-white data-[state=on]:text-purple-blaze text-purple-blaze hover:text-purple-blaze/70 hover:bg-white px-1 pt-0.5 text-xs xl:text-sm font-normal rounded-full"
        type="button"
        tabIndex={0}
      >
        <Plus className="size-4" />
        <span className="text-nowrap">Add More</span>
      </Toggle>

      {showInput && (
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="min-w-0 flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
              autoFocus
            />
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-purple-blaze text-white text-xs font-bold"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg max-h-36 overflow-y-auto z-10 mt-1">
              {loading ? (
                <div className="p-2 text-sm text-gray-500">Loading sports...</div>
              ) : filteredSuggestions.length > 0 ? (
                filteredSuggestions.slice(0, 10).map((sportName) => (
                  <button
                    key={sportName}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => handleSuggestionClick(sportName)}
                  >
                    {sportName}
                  </button>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">No suggestions found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
