import { Button } from '@/components/ui/button'
import React from 'react'
import { Loader2 } from 'lucide-react'

interface StickyNavProps {
  onNext: (e: React.FormEvent | React.MouseEvent) => void
  onSkip: (e: React.MouseEvent) => void
  nextLabel?: string
  skipLabel?: string
  className?: string
  nextDisabled?: boolean
  loading?: boolean
}

export default function StickyNav({
  onNext,
  onSkip,
  nextLabel = 'Next',
  skipLabel = 'skip',
  className = '',
  nextDisabled = false,
  loading = false,
}: StickyNavProps) {
  return (
    <div className={`sticky bottom-0 bg-white/70 pt-9 ${className}`}>
      <Button
        type="submit"
        className="w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
        onClick={onNext}
        disabled={nextDisabled || loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
          </span>
        ) : (
          nextLabel
        )}
      </Button>
      <button
        type="button"
        className="w-full text-sm font-normal p-3.5 mt-2 rounded-4xl"
        onClick={onSkip}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
          </span>
        ) : (
          skipLabel
        )}
      </button>
    </div>
  )
}
