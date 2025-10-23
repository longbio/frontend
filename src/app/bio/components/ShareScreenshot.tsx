'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
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
  const bioRef = useRef<HTMLDivElement>(null)

  const generateScreenshot = async () => {
    if (!bioRef.current) {
      setError('Element not found for screenshot generation')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Temporarily make the element visible for capture
      const element = bioRef.current
      const originalStyle = element.style.cssText

      // Make element visible but off-screen
      element.style.position = 'absolute'
      element.style.left = '-9999px'
      element.style.top = '0'
      element.style.visibility = 'visible'
      element.style.opacity = '1'
      element.style.zIndex = '1'
      element.style.width = '400px'
      element.style.height = 'auto'

      // Wait for any images to load
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Use minimal options to avoid oklch issues completely
      const canvas = await html2canvas(element, {
        backgroundColor: '#f8fafc',
        scale: 1,
        useCORS: false,
        allowTaint: false,
        logging: false,
        width: 400,
        height: 600,
        onclone: (clonedDoc) => {
          // Remove all external stylesheets that might contain oklch
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
          stylesheets.forEach((sheet) => sheet.remove())

          // Add our own completely safe styles
          const safeStyle = clonedDoc.createElement('style')
          safeStyle.textContent = `
            * {
              all: unset !important;
              display: revert !important;
              box-sizing: border-box !important;
            }
            
            div {
              display: block !important;
            }
            
            img {
              display: block !important;
              max-width: 100% !important;
              height: auto !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
              display: block !important;
              font-weight: bold !important;
              margin: 0.5em 0 !important;
            }
            
            p {
              display: block !important;
              margin: 0.5em 0 !important;
            }
            
            .rounded-full {
              border-radius: 50% !important;
            }
            
            .rounded-lg {
              border-radius: 0.5rem !important;
            }
            
            .text-center {
              text-align: center !important;
            }
            
            .font-bold {
              font-weight: bold !important;
            }
            
            .font-semibold {
              font-weight: 600 !important;
            }
            
            .text-sm {
              font-size: 0.875rem !important;
            }
            
            .text-xs {
              font-size: 0.75rem !important;
            }
            
            .text-2xl {
              font-size: 1.5rem !important;
            }
            
            .mb-2 {
              margin-bottom: 0.5rem !important;
            }
            
            .mb-4 {
              margin-bottom: 1rem !important;
            }
            
            .mb-6 {
              margin-bottom: 1.5rem !important;
            }
            
            .mt-6 {
              margin-top: 1.5rem !important;
            }
            
            .p-3 {
              padding: 0.75rem !important;
            }
            
            .p-6 {
              padding: 1.5rem !important;
            }
            
            .pt-4 {
              padding-top: 1rem !important;
            }
            
            .w-16 {
              width: 4rem !important;
            }
            
            .h-16 {
              height: 4rem !important;
            }
            
            .w-20 {
              width: 5rem !important;
            }
            
            .h-20 {
              height: 5rem !important;
            }
            
            .mx-auto {
              margin-left: auto !important;
              margin-right: auto !important;
            }
            
            .flex {
              display: flex !important;
            }
            
            .items-center {
              align-items: center !important;
            }
            
            .justify-center {
              justify-content: center !important;
            }
            
            .space-y-4 > * + * {
              margin-top: 1rem !important;
            }
            
            .object-cover {
              object-fit: cover !important;
            }
            
            .shadow-sm {
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            }
            
            .border-t {
              border-top-width: 1px !important;
            }
          `
          clonedDoc.head.appendChild(safeStyle)

          // Force safe colors on all elements
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement
            htmlEl.style.color = '#1f2937'
            htmlEl.style.backgroundColor = 'transparent'
            htmlEl.style.borderColor = '#e5e7eb'
          })
        },
      })

      console.log('Canvas generated:', canvas.width, 'x', canvas.height)

      // Restore original style
      element.style.cssText = originalStyle

      const dataURL = canvas.toDataURL('image/png', 1.0)
      console.log('Screenshot generated successfully')
      setScreenshot(dataURL)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error generating screenshot:', error)
      const errorMessage = `Failed to generate screenshot: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
      setError(errorMessage)

      // Call error callback if provided
      if (onError) {
        onError(errorMessage)
      }

      // Restore original style in case of error
      if (bioRef.current) {
        bioRef.current.style.cssText = bioRef.current.style.cssText
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
      // Convert data URL to blob
      const response = await fetch(screenshot)
      const blob = await response.blob()
      const file = new File([blob], `${userData.fullName}-bio.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${userData.fullName}'s Bio`,
          text: `Check out ${userData.fullName}'s bio on LongBio!`,
          files: [file],
        })
      } else {
        // Fallback to download
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
                <Image
                  src={screenshot}
                  alt="Bio Screenshot"
                  width={400}
                  height={300}
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadScreenshot}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <button
                  onClick={shareScreenshot}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Bio for Screenshot */}
        <div
          ref={bioRef}
          className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none"
          style={{
            width: '400px',
            height: 'auto',
            background: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            className="p-6 w-full"
            style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              minHeight: '600px',
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(90deg, #ddd6fe 0%, #fbcfe8 100%)',
                }}
              >
                {userData.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full" style={{ background: '#d1d5db' }}></div>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>
                {userData.fullName}
              </h2>
              <p className="text-sm" style={{ color: '#4b5563' }}>
                {userData.educationalStatus === 'student'
                  ? 'Student'
                  : userData.educationalStatus === 'graduated'
                  ? 'Graduated'
                  : 'Professional'}
              </p>
            </div>

            {/* Bio Content */}
            <div className="space-y-4">
              {userData.birthDate && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>
                    Birth Date
                  </h3>
                  <p className="text-sm" style={{ color: '#4b5563' }}>
                    {userData.birthDate}
                  </p>
                </div>
              )}

              {userData.job && (userData.job.position || userData.job.company) && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>
                    Job
                  </h3>
                  {userData.job.position && (
                    <p className="text-sm" style={{ color: '#4b5563' }}>
                      Position: {userData.job.position}
                    </p>
                  )}
                  {userData.job.company && (
                    <p className="text-sm" style={{ color: '#4b5563' }}>
                      Company: {userData.job.company}
                    </p>
                  )}
                </div>
              )}

              {userData.details && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#111827' }}>
                    About
                  </h3>
                  <p className="text-sm" style={{ color: '#4b5563' }}>
                    {userData.details}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="text-center mt-6 pt-4"
              style={{
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <p className="text-xs" style={{ color: '#6b7280' }}>
                Powered by LongBio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
