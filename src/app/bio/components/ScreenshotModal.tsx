'use client'

import Image from 'next/image'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ScreenshotModalProps {
  isOpen: boolean
  onClose: () => void
  screenshot: string | null
  isGenerating: boolean
  onShare: () => void
  error?: string | null
}

export default function ScreenshotModal({
  isOpen,
  onClose,
  screenshot,
  isGenerating,
  onShare,
  error,
}: ScreenshotModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bio Screenshot</DialogTitle>
          <DialogDescription>Share your bio screenshot with friends</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isGenerating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating screenshot...</p>
            </div>
          ) : screenshot ? (
            <>
              {/* Screenshot Preview */}
              <div className="text-center">
                <Image
                  src={screenshot}
                  alt="Bio Screenshot"
                  width={600}
                  height={400}
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                />
              </div>

              {/* Share Button */}
              <div className="flex justify-center">
                <Button
                  onClick={onShare}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Share2 className="w-5 h-5" />
                  Share Screenshot
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
