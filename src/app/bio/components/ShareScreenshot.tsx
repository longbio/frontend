'use client'

import Image from 'next/image'
import { useState } from 'react'
import html2canvas from '@html2canvas/html2canvas'
import { Download, Share2, X } from 'lucide-react'
import type { GetUserByIdResponse } from '@/service/user/type'

interface ShareScreenshotProps {
  userData: GetUserByIdResponse['data']
  onClose: () => void
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function ShareScreenshot({
  userData,
  onClose,
  onSuccess,
  onError,
}: ShareScreenshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateScreenshot = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const element = document.getElementById('bio-content')
      if (!element) {
        setError('Bio content element not found')
        setIsGenerating(false)
        return
      }

      // Wait for any images to load
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Ensure all images are loaded
      const images = element.querySelectorAll('img')
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true)
          } else {
            img.onload = () => resolve(true)
            img.onerror = () => resolve(true)
            setTimeout(() => resolve(true), 3000)
          }
        })
      })

      await Promise.all(imagePromises)

      // Scroll to top to capture everything
      element.scrollIntoView({ behavior: 'instant', block: 'start' })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get the actual content dimensions (not just visible)
      const fullHeight = element.scrollHeight
      const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, 800) // Ensure minimum width

      const originalOverflow = element.style.overflow
      const originalMaxHeight = element.style.maxHeight
      const originalHeight = element.style.height

      element.style.overflow = 'visible'
      element.style.maxHeight = 'none'
      element.style.height = 'auto'

      void element.offsetHeight

      const canvas = await html2canvas(element, {
        backgroundColor: '#f9fafb',
        scale: 1.0,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: fullWidth,
        height: fullHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        x: 0,
        y: 0,
        foreignObjectRendering: true,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Fix oklch colors and ensure all content is visible
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement

            // Make sure all content is visible
            htmlEl.style.overflow = 'visible'
            htmlEl.style.overflowX = 'visible'
            htmlEl.style.overflowY = 'visible'
            htmlEl.style.maxHeight = 'none'
            htmlEl.style.height = 'auto'
            htmlEl.style.maxWidth = 'none'
            htmlEl.style.width = 'auto'

            // Fix any oklch colors by replacing with safe colors
            if (htmlEl.style.color && htmlEl.style.color.includes('oklch')) {
              htmlEl.style.color = '#1f2937'
            }
            if (htmlEl.style.backgroundColor && htmlEl.style.backgroundColor.includes('oklch')) {
              htmlEl.style.backgroundColor = 'transparent'
            }
            if (htmlEl.style.borderColor && htmlEl.style.borderColor.includes('oklch')) {
              htmlEl.style.borderColor = '#e5e7eb'
            }
          })

          // Set minimum width for the main container
          const mainContainer = clonedDoc.querySelector('#bio-content') as HTMLElement
          if (mainContainer) {
            mainContainer.style.minWidth = '800px'
            mainContainer.style.width = '800px'
            mainContainer.style.maxWidth = 'none'
          }
        },
      })

      const dataURL = canvas.toDataURL('image/png', 1.0) // Maximum quality PNG

      // Check if dataURL is valid
      if (!dataURL || dataURL === 'data:,') {
        throw new Error('Failed to generate valid image data')
      }

      // Restore original styles
      element.style.overflow = originalOverflow
      element.style.maxHeight = originalMaxHeight
      element.style.height = originalHeight

      setScreenshot(dataURL)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = `Failed to generate screenshot: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadScreenshot = () => {
    if (!screenshot) return

    const link = document.createElement('a')
    link.download = `${userData.fullName}-bio.png`
    link.href = screenshot
    link.click()
  }

  const shareScreenshot = async () => {
    if (!screenshot) return

    try {
      const response = await fetch(screenshot)
      const blob = await response.blob()
      const file = new File([blob], `${userData.fullName}-bio.png`, { type: 'image/png' })

      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${userData.fullName}'s Bio`,
          text: `Check out ${userData.fullName}'s bio on LongBio!`,
          files: [file],
        })
      } else {
        downloadScreenshot()
      }
    } catch (error) {
      console.error('Error sharing screenshot:', error)
      downloadScreenshot()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Share Bio Screenshot</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-500 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {!screenshot ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Beautiful Screenshot
                </h4>
                <p className="text-gray-600 text-sm">
                  Generate a stunning screenshot of {userData.fullName}&apos;s bio to share with
                  friends
                </p>
              </div>

              <button
                onClick={generateScreenshot}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Generate Screenshot
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Screenshot Generated Successfully!
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-h-[30rem] max-w-full flex items-center justify-center">
                  <Image
                    src={screenshot}
                    alt="Bio Screenshot"
                    width={800}
                    height={610}
                    className="w-full h-auto object-contain"
                    quality={100}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={downloadScreenshot}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={shareScreenshot}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
