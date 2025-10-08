'use client'

import Image from 'next/image'
import html2canvas from 'html2canvas'
import { useState, useRef } from 'react'
import { Download, Share2, X } from 'lucide-react'
import type { GetUserByIdResponse } from '@/service/user/type'

interface ShareScreenshotProps {
  userData: GetUserByIdResponse['data']
  onClose: () => void
}

export default function ShareScreenshot({ userData, onClose }: ShareScreenshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const bioRef = useRef<HTMLDivElement>(null)

  const generateScreenshot = async () => {
    if (!bioRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(bioRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      const dataURL = canvas.toDataURL('image/png')
      setScreenshot(dataURL)
    } catch (error) {
      console.error('Error generating screenshot:', error)
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
        <div ref={bioRef} className="hidden">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                {userData.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.fullName}</h2>
              <p className="text-gray-600 text-sm">
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
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Birth Date</h3>
                  <p className="text-gray-600 text-sm">{userData.birthDate}</p>
                </div>
              )}

              {userData.job && (userData.job.position || userData.job.company) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Job</h3>
                  {userData.job.position && (
                    <p className="text-gray-600 text-sm">Position: {userData.job.position}</p>
                  )}
                  {userData.job.company && (
                    <p className="text-gray-600 text-sm">Company: {userData.job.company}</p>
                  )}
                </div>
              )}

              {userData.details && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">About</h3>
                  <p className="text-gray-600 text-sm">{userData.details}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Powered by LongBio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
