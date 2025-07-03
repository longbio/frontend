import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

interface AddButtonProps {
  options: string[]
  setOptions: (opts: string[]) => void
  placeholder?: string
}

export default function AddButton({
  options,
  setOptions,
  placeholder = 'Add your own...',
}: AddButtonProps) {
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
    <div className="flex flex-wrap max-w-full items-center gap-2">
      <Toggle
        pressed={showInput}
        onPressedChange={() => setShowInput((prev) => !prev)}
        className="data-[state=on]:bg-white data-[state=on]:text-purple-blaze text-purple-blaze hover:text-purple-blaze/70 hover:bg-white px-1 pt-0.5 text-xs xl:text-sm font-normal rounded-full"
        type="button"
        tabIndex={0}
      >
        <Plus className="size-4" />
        <span className="text-nowrap">Add More</span>
      </Toggle>
      {showInput && (
        <input
          type="text"
          className="min-w-0 flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-blaze"
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
          className="px-3 py-1 rounded-full bg-purple-blaze text-white text-xs font-bold ml-2"
          onClick={handleAdd}
        >
          Add
        </button>
      )}
    </div>
  )
}
