import { Button } from '@/components/ui/button'
import React from 'react'

interface StickyNavProps {
  onNext: (e: React.FormEvent | React.MouseEvent) => void
  onSkip: (e: React.MouseEvent) => void
  nextLabel?: string
  skipLabel?: string
  className?: string
  nextDisabled?: boolean
}

export default function StickyNav({
  onNext,
  onSkip,
  nextLabel = 'Next',
  skipLabel = 'skip',
  className = '',
  nextDisabled = false,
}: StickyNavProps) {
  return (
    <div className={`sticky bottom-0 bg-white/70 pt-9 ${className}`}>
      <Button
        type="submit"
        className="w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
      </Button>
      <button
        type="button"
        className="w-full text-sm font-normal p-3.5 mt-2 rounded-4xl"
        onClick={onSkip}
      >
        {skipLabel}
      </button>
    </div>
  )
}
