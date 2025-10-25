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

  const preloadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
      img.src = src
    })
  }

  const generateScreenshot = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      let element = document.getElementById('bio-content')

      if (!element) {
        element = document.querySelector('.flex-1.px-4.pt-8.pb-4.overflow-y-auto') as HTMLElement
      }

      if (!element) {
        setError('Bio content element not found')
        setIsGenerating(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const images = element.querySelectorAll('img')
      for (const img of images) {
        const imgElement = img as HTMLImageElement

        imgElement.style.display = 'block'
        imgElement.style.visibility = 'visible'
        imgElement.style.opacity = '1'

        if (imgElement.src && !imgElement.complete) {
          try {
            await preloadImage(imgElement.src)
          } catch {
            console.warn('Failed to preload image:', imgElement.src)
          }
        })
      })

      await Promise.all(imagePromises)

      // Scroll to center the content vertically
      element.scrollIntoView({ behavior: 'instant', block: 'center' })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Scroll the page to center the content
      const elementRect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollTop =
        elementRect.top + window.scrollY - viewportHeight / 2 + elementRect.height / 2
      window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Temporarily modify the element to show all content
      const originalStyles = {
        overflow: element.style.overflow,
        overflowY: element.style.overflowY,
        maxHeight: element.style.maxHeight,
        height: element.style.height,
        position: element.style.position,
        transform: element.style.transform,
      }

      // Make element fully visible
      element.style.overflow = 'visible'
      element.style.overflowY = 'visible'
      element.style.maxHeight = 'none'
      element.style.height = 'auto'
      element.style.position = 'static'
      element.style.transform = 'none'

      // Force reflow
      void element.offsetHeight

      // Get the actual dimensions after making it visible
      const rect = element.getBoundingClientRect()
      const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, rect.height)
      const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, rect.width, 800)

      console.log('Element dimensions:', {
        scrollHeight: element.scrollHeight,
        offsetHeight: element.offsetHeight,
        rectHeight: rect.height,
        scrollWidth: element.scrollWidth,
        offsetWidth: element.offsetWidth,
        rectWidth: rect.width,
        finalHeight: fullHeight,
        finalWidth: fullWidth,
      })

      // Wait for all content to be rendered
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = await html2canvas(element, {
        backgroundColor: '#f9fafb',
        scale: 2.0,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: actualWidth,
        height: actualHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        x: 0,
        y: 0,
        foreignObjectRendering: true,
        removeContainer: true,
        imageTimeout: 15000,
        ignoreElements: (element) => {
          // Ignore elements that might cause issues
          return element.classList.contains('ignore-screenshot')
        },
        onclone: (clonedDoc) => {
          // Center the content vertically in the cloned document
          const bioContent = clonedDoc.querySelector('#bio-content') as HTMLElement
          if (bioContent) {
            bioContent.style.display = 'flex'
            bioContent.style.flexDirection = 'column'
            bioContent.style.justifyContent = 'center'
            bioContent.style.alignItems = 'center'
            bioContent.style.minHeight = '100vh'
            bioContent.style.padding = '2rem 0'
          }

          // Remove all height restrictions and make everything visible
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement
            htmlEl.style.overflow = 'visible'
            htmlEl.style.overflowY = 'visible'
            htmlEl.style.maxHeight = 'none'
            htmlEl.style.height = 'auto'
            htmlEl.style.maxWidth = 'none'
            htmlEl.style.width = 'auto'
            htmlEl.style.position = 'static'
            htmlEl.style.transform = 'none'
          })

          // Specifically target the bio content container
          const bioContentClone = clonedDoc.querySelector('#bio-content') as HTMLElement
          if (bioContentClone) {
            bioContentClone.style.height = 'auto'
            bioContentClone.style.maxHeight = 'none'
            bioContentClone.style.overflow = 'visible'
            bioContentClone.style.overflowY = 'visible'
            bioContentClone.style.position = 'static'
            bioContentClone.style.transform = 'none'
          }

          // Target the inner flex container
          const flexContainer = clonedDoc.querySelector('#bio-content .flex-1') as HTMLElement
          if (flexContainer) {
            flexContainer.style.height = 'auto'
            flexContainer.style.maxHeight = 'none'
            flexContainer.style.overflow = 'visible'
            flexContainer.style.overflowY = 'visible'
            flexContainer.style.position = 'static'
            flexContainer.style.transform = 'none'
          }

          // Remove any CSS that might limit height
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
          stylesheets.forEach((sheet) => sheet.remove())

          const safeStyle = clonedDoc.createElement('style')
          safeStyle.textContent = `
            * {
              all: unset !important;
              display: revert !important;
              box-sizing: border-box !important;
            }
            
            #bio-content {
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              overflow-y: visible !important;
              position: static !important;
              transform: none !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              min-height: 100vh !important;
              padding: 2rem 0 !important;
            }
            
            #bio-content .flex-1 {
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              overflow-y: visible !important;
              position: static !important;
              transform: none !important;
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
            
            .rounded-2xl {
              border-radius: 1rem !important;
            }
            
            .rounded-xl {
              border-radius: 0.75rem !important;
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
            
            .text-lg {
              font-size: 1.125rem !important;
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
            
            .mt-4 {
              margin-top: 1rem !important;
            }
            
            .p-3 {
              padding: 0.75rem !important;
            }
            
            .p-4 {
              padding: 1rem !important;
            }
            
            .p-6 {
              padding: 1.5rem !important;
            }
            
            .pt-8 {
              padding-top: 2rem !important;
            }
            
            .pb-4 {
              padding-bottom: 1rem !important;
            }
            
            .px-4 {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
            
            .w-24 {
              width: 6rem !important;
            }
            
            .h-24 {
              height: 6rem !important;
            }
            
            .w-16 {
              width: 4rem !important;
            }
            
            .h-16 {
              height: 4rem !important;
            }
            
            .w-5 {
              width: 1.25rem !important;
            }
            
            .h-5 {
              height: 1.25rem !important;
            }
            
            .w-4 {
              width: 1rem !important;
            }
            
            .h-4 {
              height: 1rem !important;
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
            
            .justify-between {
              justify-content: space-between !important;
            }
            
            .gap-1 {
              gap: 0.25rem !important;
            }
            
            .gap-2 {
              gap: 0.5rem !important;
            }
            
            .gap-3 {
              gap: 0.75rem !important;
            }
            
            .gap-4 {
              gap: 1rem !important;
            }
            
            .gap-6 {
              gap: 1.5rem !important;
            }
            
            .space-y-1 > * + * {
              margin-top: 0.25rem !important;
            }
            
            .space-y-2 > * + * {
              margin-top: 0.5rem !important;
            }
            
            .space-y-3 > * + * {
              margin-top: 0.75rem !important;
            }
            
            .object-cover {
              object-fit: cover !important;
            }
            
            .shadow-sm {
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            }
            
            .shadow-lg {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .border {
              border-width: 1px !important;
            }
            
            .border-4 {
              border-width: 4px !important;
            }
            
            .border-t {
              border-top-width: 1px !important;
            }
            
            .overflow-hidden {
              overflow: hidden !important;
            }
            
            .overflow-y-auto {
              overflow-y: auto !important;
            }
            
            .flex-wrap {
              flex-wrap: wrap !important;
            }
            
            .flex-shrink-0 {
              flex-shrink: 0 !important;
            }
            
            .whitespace-nowrap {
              white-space: nowrap !important;
            }
            
            .capitalize {
              text-transform: capitalize !important;
            }
          `
          clonedDoc.head.appendChild(safeStyle)

          // Fix oklch colors and ensure all content is visible
          const allElementsClone = clonedDoc.querySelectorAll('*')
          allElementsClone.forEach((el) => {
            const htmlEl = el as HTMLElement

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

          // Log all images to see their sources
          const images = clonedDoc.querySelectorAll('img')
          images.forEach((img, index) => {
            console.log(`Image ${index + 1} src:`, img.src)
            console.log(`Image ${index + 1} alt:`, img.alt)
          })
        },
      })

      // Restore original styles
      element.style.overflow = originalStyles.overflow
      element.style.overflowY = originalStyles.overflowY
      element.style.maxHeight = originalStyles.maxHeight
      element.style.height = originalStyles.height
      element.style.position = originalStyles.position
      element.style.transform = originalStyles.transform

      console.log('Canvas generated:', canvas.width, 'x', canvas.height)

      const dataURL = canvas.toDataURL('image/png', 1.0)
      console.log('Screenshot generated successfully')
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Share Bio Screenshot</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(85vh-85px)] overflow-y-auto">
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
            <div className="space-y-3">
              {/* Preview */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Screenshot Generated Successfully!
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-h-[57vh] flex items-center justify-center">
                  <Image
                    src={screenshot}
                    alt="Bio Screenshot"
                    width={600}
                    height={400}
                    className="w-full scale-[55%] object-cover max-h-full"
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
