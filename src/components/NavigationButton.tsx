'use client'
import clsx from 'clsx'
import { ChevronLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NavigationButtonProps = {
  className?: string
  isEditMode?: boolean
}

export default function NavigationButton({ className, isEditMode = false }: NavigationButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (isEditMode) {
      router.push('/bio')
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'flex items-center justify-center w-10 h-10 rounded-full',
        'bg-white border border-gray-200 shadow-sm',
        'hover:bg-gray-50 hover:border-gray-300',
        'active:scale-95 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-blaze/20',
        className
      )}
      aria-label={isEditMode ? 'Return to bio page' : 'Go back'}
    >
      {isEditMode ? (
        <Check className="w-5 h-5 text-gray-700" strokeWidth={2} />
      ) : (
        <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
      )}
    </button>
  )
}

