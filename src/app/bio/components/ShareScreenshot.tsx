'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import { useState, useRef } from 'react'
import html2canvas from '@html2canvas/html2canvas'
import {
  Download,
  Share2,
  X,
  Calendar,
  User,
  Heart,
  Venus,
  Mars,
  GraduationCap,
  Star,
  MapPin,
  PawPrint,
  CheckCircle,
  Dumbbell,
  Briefcase,
  Globe,
  Sparkles,
} from 'lucide-react'
interface UserData {
  id: number
  username: string
  birthDate: string | null
  fullName: string
  gender: string
  maritalStatus: string
  educationalStatus: string
  profileImage: string
  isVerified?: boolean
  height: number
  weight: number
  bornPlace: string
  livePlace: string
  doesExercise: boolean
  favoriteSport: string[]
  travelStyle: string[]
  details: string
  education: {
    topic: string
    university: string
    graduationYear: string
  }
  job: {
    company: string
    position: string
  }
  pet: {
    name: string
    breed: string
  }
  skills: string[] | null
  interests: string[] | null
  visitedCountries: string[] | null
}

interface ShareScreenshotProps {
  userData: UserData
  onClose: () => void
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function ShareScreenshot({
  userData,
  onClose,
  onError,
  onSuccess,
}: ShareScreenshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const screenshotRef = useRef<HTMLDivElement>(null)

  const age = userData.birthDate
    ? new Date().getFullYear() - new Date(userData.birthDate).getFullYear()
    : null

  const skillMapping: { [key: string]: string } = {
    '1': 'Sports',
    '2': 'Painting',
    '3': 'Music',
    '4': 'Singing',
    '5': 'Cultural Travel',
    '6': 'Dancing',
    '7': 'Physics and Math',
    '8': 'Cooking',
    '9': 'Photography',
    '10': 'Road Trip',
    '11': 'Eco-Tourism',
  }

  const displaySkills = userData.skills?.map((skill) => skillMapping[skill] || skill) || []
  const displayInterests = userData.interests || []

  const generateScreenshot = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        setError('Browser environment not available')
        setIsGenerating(false)
        return
      }

      const element = screenshotRef.current
      if (!element) {
        setError('Screenshot content element not found')
        setIsGenerating(false)
        return
      }

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Pre-process the element to remove any oklch references from inline styles
      const allOriginalElements = element.querySelectorAll('*')
      allOriginalElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const style = htmlEl.getAttribute('style')
        if (style && style.includes('oklch')) {
          // Remove the style attribute if it contains oklch
          htmlEl.removeAttribute('style')
        }
      })

      const canvas = await html2canvas(element, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: false,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        ignoreElements: () => false,
        onclone: (clonedDoc) => {
          const allStylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
          allStylesheets.forEach((sheet) => sheet.remove())

          const allElementsWithStyles = clonedDoc.querySelectorAll('*')
          allElementsWithStyles.forEach((el) => {
            const htmlEl = el as HTMLElement
            htmlEl.removeAttribute('style')
          })

          // Process images
          const clonedImages = clonedDoc.querySelectorAll('img')
          clonedImages.forEach((img) => {
            const htmlImg = img as HTMLImageElement
            htmlImg.style.display = 'block'
            htmlImg.style.objectFit = 'cover'
            htmlImg.style.borderRadius = '50%'
          })

          // Process SVG icons to preserve colors
          const allSvgs = clonedDoc.querySelectorAll('svg')
          allSvgs.forEach((svg) => {
            const htmlSvg = svg as unknown as HTMLElement
            const classList = htmlSvg.getAttribute('class') || ''

            // Determine color based on Tailwind classes
            let iconColor = '#6b7280' // default gray
            if (classList.includes('text-purple-600')) {
              iconColor = '#9333ea'
            } else if (classList.includes('text-blue-500')) {
              iconColor = '#3b82f6'
            } else if (classList.includes('text-blue-600')) {
              iconColor = '#2563eb'
            } else if (classList.includes('text-gray-600')) {
              iconColor = '#4b5563'
            }

            // Find all path, circle, rect elements inside this SVG
            const paths = svg.querySelectorAll('path, circle, rect, polygon')
            paths.forEach((path) => {
              const pathEl = path as HTMLElement
              // Apply fill for solid icons, keep stroke for outline icons
              pathEl.style.setProperty('stroke', iconColor, 'important')
              pathEl.style.setProperty('fill', 'none', 'important')
            })
          })

          // Force-set inline styles for all elements to override any computed oklch colors
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement

            // Map common Tailwind classes to safe colors via inline styles
            const classList = String(htmlEl.className || '')

            // Apply Tailwind class-based overrides to force safe hex colors
            if (classList.includes('bg-white'))
              htmlEl.style.setProperty('background-color', '#ffffff', 'important')
            if (classList.includes('bg-gray-50'))
              htmlEl.style.setProperty('background-color', '#f9fafb', 'important')
            if (classList.includes('bg-gray-100'))
              htmlEl.style.setProperty('background-color', '#f3f4f6', 'important')
            if (classList.includes('bg-pink-50'))
              htmlEl.style.setProperty('background-color', '#fdf2f8', 'important')
            if (classList.includes('bg-pink-100'))
              htmlEl.style.setProperty('background-color', '#fce7f3', 'important')
            if (classList.includes('bg-blue-100'))
              htmlEl.style.setProperty('background-color', '#dbeafe', 'important')
            if (classList.includes('bg-purple-100'))
              htmlEl.style.setProperty('background-color', '#f3e8ff', 'important')
            if (classList.includes('bg-purple-50'))
              htmlEl.style.setProperty('background-color', '#faf5ff', 'important')
            if (classList.includes('bg-red-100'))
              htmlEl.style.setProperty('background-color', '#fee2e2', 'important')
            if (classList.includes('bg-green-100'))
              htmlEl.style.setProperty('background-color', '#dcfce7', 'important')

            if (classList.includes('text-gray-900'))
              htmlEl.style.setProperty('color', '#111827', 'important')
            if (classList.includes('text-gray-700'))
              htmlEl.style.setProperty('color', '#374151', 'important')
            if (classList.includes('text-gray-600'))
              htmlEl.style.setProperty('color', '#4b5563', 'important')
            if (classList.includes('text-gray-500'))
              htmlEl.style.setProperty('color', '#6b7280', 'important')
            if (classList.includes('text-pink-700'))
              htmlEl.style.setProperty('color', '#be185d', 'important')
            if (classList.includes('text-blue-600'))
              htmlEl.style.setProperty('color', '#2563eb', 'important')
            if (classList.includes('text-blue-700'))
              htmlEl.style.setProperty('color', '#1e40af', 'important')
            if (classList.includes('text-purple-600'))
              htmlEl.style.setProperty('color', '#9333ea', 'important')
            if (classList.includes('text-red-700'))
              htmlEl.style.setProperty('color', '#b91c1c', 'important')
            if (classList.includes('text-green-700'))
              htmlEl.style.setProperty('color', '#15803d', 'important')
            if (classList.includes('border-purple-200'))
              htmlEl.style.setProperty('border-color', '#e9d5ff', 'important')
            if (classList.includes('border-purple-100'))
              htmlEl.style.setProperty('border-color', '#f3e8ff', 'important')
            if (classList.includes('border-gray-200'))
              htmlEl.style.setProperty('border-color', '#e5e7eb', 'important')
            if (classList.includes('border-gray-100'))
              htmlEl.style.setProperty('border-color', '#f3f4f6', 'important')
          })

          // Add completely custom safe stylesheet with NO oklch colors
          const style = clonedDoc.createElement('style')
          style.textContent = `
            @font-face {
              font-family: 'Gilroy';
              src: url('./fonts/Gilroy-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Gilroy';
              src: url('./fonts/Gilroy-SemiBold.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Gilroy';
              src: url('./fonts/Gilroy-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Gilroy';
              src: url('./fonts/Gilroy-ExtaBold.woff2') format('woff2');
              font-weight: 800;
              font-style: normal;
              font-display: swap;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: 'Gilroy', system-ui, -apple-system, sans-serif;
              background-color: #f8fafc;
            }

            /* Layout utilities */
            .flex { display: flex; }
            .flex-wrap { flex-wrap: wrap; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .justify-center { justify-content: center; }
            .leading-5 {line-height:19px}
            .gap-0\.5 { gap: 0.125rem; }
            .gap-1 { gap: 0.25rem; }
            .gap-1\.5 { gap: 0.375rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-3 { gap: 0.75rem; }
            .gap-4 { gap: 1rem; }
            .gap-5 { gap: 1.25rem; }
            .gap-6 { gap: 1.5rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .w-12 { width: 3rem; }
            .h-12 { height: 3rem; }
            .flex-shrink-0 { flex-shrink: 0; }
            .space-y-0\.5 > * + * { margin-top: 0.125rem; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .space-y-1\.5 > * + * { margin-top: 0.375rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .mb-0\.5 { margin-bottom: 0.125rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-1\.5 { margin-top: 0.375rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-3 { margin-top: 0.75rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
            .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
            .p-1\.5 { padding: 0.375rem; }
            .p-2 { padding: 0.5rem; }
            .p-2\.5 { padding: 0.625rem; }
            .p-3 { padding: 0.75rem; }
            .p-4 { padding: 1rem; }
            .p-5 { padding: 1.25rem; }
            .p-6 { padding: 1.5rem; }
            .p-8 { padding: 2rem; }
            .px-1\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .px-2\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
            .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .py-0\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
            .pt-1\.5 { padding-top: 0.375rem; }
            .pt-2 { padding-top: 0.5rem; }
            .pt-3 { padding-top: 0.71rem; }
            .pt-4 { padding-top: 1rem; }
            .pt-5 { padding-top: 1.25rem; }
            .py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
            .pb-1\.5 { padding-bottom: 0.375rem; }
            .pb-2 { padding-bottom: 0.5rem; }
            .pb-3 { padding-bottom: 0.75rem; }
            .pb-4 { padding-bottom: 1rem; }
            .pb-5 { padding-bottom: 1.25rem; }
            .text-center { text-align: center; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-xl { border-radius: 0.75rem; }
            .rounded-2xl { border-radius: 1rem; }
            .rounded-3xl { border-radius: 1.5rem; }
            .rounded-full { border-radius: 9999px; }
            .whitespace-nowrap { white-space: nowrap; }
            .overflow-hidden { overflow: hidden; }
            .border { border-width: 1px; }
            .border-t { border-top-width: 1px; }
            .text-xs { font-size: 0.37rem; line-height: 1rem; }
            .text-sm { font-size: 0.42rem; }
            .text-base { font-size: 0.7rem; }
            .text-xl { font-size: 1.25rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            [style*="font-size: 11px"] { font-size: 0.6875rem !important; }
            [style*="font-size: 10px"] { font-size: 0.625rem !important; }
            [style*="font-size: 9px"] { font-size: 0.5625rem !important; }
            [style*="font-size: 8px"] { font-size: 0.5rem !important; }
            [style*="font-size: 7px"] { font-size: 0.4375rem !important; }
            [style*="font-size: 6px"] { font-size: 0.375rem !important; }
            [style*="font-size: 5px"] { font-size: 0.3125rem !important; }
            [style*="font-size: 4px"] { font-size: 0.25rem !important; }
            .overflow-hidden { overflow: hidden; }
            .text-ellipsis { 
              text-overflow: ellipsis; 
              white-space: nowrap; 
              overflow: hidden; 
            }
            .line-clamp-1 {
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
            .line-clamp-2 {
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .line-clamp-3 {
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
            }
            .w-1 { width: 0.55rem; }
            .h-4 { height: 0.8rem; }
            .w-2\.5 { width: 0.625rem; }
            .h-2\.5 { height: 0.625rem; }
            .w-3 { width: 0.75rem; }
            .h-3 { height: 0.75rem; }
            .w-3\.5 { width: 0.875rem; }
            .h-3\.5 { height: 0.875rem; }
            .w-4 { width: 1rem; }
            .h-1 { height: 0.55rem; }
            .h-4 { height: 1rem; }
            .w-5 { width: 1.25rem; }
            .h-5 { height: 1.25rem; }
            .w-6 { width: 1.5rem; }
            .h-6 { height: 1.5rem; }
            .w-7 { width: 1.75rem; }
            .h-7 { height: 1.75rem; }
            .w-8 { width: 2rem; }
            .h-8 { height: 2rem; }
            .w-12 { width: 2.8rem; }
            .h-12 { height: 2.8rem; }
            .w-14 { width: 3rem; }
            .h-14 { height: 3rem; }
            .w-16 { width: 4rem; }
            .h-16 { height: 4rem; }
            .w-20 { width: 4.5rem; }
            .h-20 { height: 4.5rem; }
            .w-24 { width: 4.8rem; }
            .h-24 { height: 4.8rem; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .flex-shrink-0 { flex-shrink: 0; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
            .border-2 { border-width: 2px; }
            .border-3 { border-width: 3px; }
            .border-4 { border-width: 4px; }
            .border-gray-200 { border-color: #e5e7eb; }
            .border-gray-300 { border-color: #d1d5db; }
            .border-purple-200 { border-color: #e9d5ff; }
            .font-medium { font-weight: 500; }
            .object-cover { object-fit: cover; }
            .leading-relaxed { line-height: 1.625; }
            .border-purple-100 { border-color: #f3e8ff; }
            [class*="via-purple-50"] { background-color: #faf5ff; }
            [class*="via-pink-50"] { background-color: #fdf2f8; }

            /* Colors - Safe hex colors only */
            [class*="bg-white"] { background-color: #ffffff; }
            [class*="bg-gray-50"] { background-color: #f9fafb; }
            [class*="bg-gray-100"] { background-color: #f3f4f6; }
            [class*="bg-pink-50"] { background-color: #fdf2f8; }
            [class*="bg-pink-100"] { background-color: #fce7f3; }
            [class*="bg-blue-100"] { background-color: #dbeafe; }
            [class*="bg-purple-100"] { background-color: #f3e8ff; }
            [class*="bg-purple-50"] { background-color: #faf5ff; }
            [class*="bg-red-100"] { background-color: #fee2e2; }
            [class*="bg-green-100"] { background-color: #dcfce7; }
            [class*="from-purple-50"][class*="via-pink-50"][class*="to-purple-50"] { background: linear-gradient(to bottom right, #faf5ff, #fdf2f8, #faf5ff); }
            [class*="from-gray-50"][class*="to-white"] { background: linear-gradient(to bottom right, #f9fafb, #ffffff); }
            [class*="from-purple-100"][class*="to-pink-100"] { background: linear-gradient(to right, #f3e8ff, #fce7f3); }
            [class*="bg-gradient-to-br"] { background: linear-gradient(to bottom right, #f9fafb, #f3f4f6); }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .max-w-4xl { max-width: 56rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-lg { font-size: 1.125rem; }
            
            [class*="text-gray-900"] { color: #111827; }
            [class*="text-gray-700"] { color: #374151; }
            [class*="text-gray-600"] { color: #4b5563; }
            [class*="text-gray-500"] { color: #6b7280; }
            [class*="text-pink-700"] { color: #be185d; }
            [class*="text-blue-600"] { color: #2563eb; }
            [class*="text-blue-700"] { color: #1e40af; }
            [class*="text-purple-600"] { color: #9333ea; }
            [class*="text-red-700"] { color: #b91c1c; }
            [class*="text-green-700"] { color: #15803d; }
            
            [class*="border-purple-200"] { border-color: #e9d5ff; }
            [class*="border-purple-100"] { border-color: #f3e8ff; }
            [class*="border-gray-200"] { border-color: #e5e7eb; }
            [class*="border-gray-100"] { border-color: #f3f4f6; }

            img {
              display: block;
              max-width: 100%;
              height: auto;
            }
          `
          clonedDoc.head.appendChild(style)
        },
      })

      const dataURL = canvas.toDataURL('image/png', 1.0)
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
    if (typeof document === 'undefined') return

    const link = document.createElement('a')
    link.download = `${userData.username}-bio.png`
    link.href = screenshot
    link.click()
  }

  const shareScreenshot = async () => {
    if (!screenshot) return

    try {
      const response = await fetch(screenshot)
      const blob = await response.blob()
      const file = new File([blob], `${userData.username}-bio.png`, { type: 'image/png' })

      if (
        typeof window !== 'undefined' &&
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
    <>
      {/* Hidden screenshot content */}
      <div
        ref={screenshotRef}
        className="ignore-screenshot fixed left-1/2 top-0 w-[360px] bg-gradient-to-br from-gray-50 to-gray-100"
        style={{
          fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
          width: '360px',
          minHeight: '600px',
          transform: 'translateX(-50%)',
          visibility: 'hidden',
        }}
      >
        <div className="w-full px-2 pt-3 pb-2">
          {/* Header Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Create your longBio, share it!</p>
          </div>

          {/* Compact Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 mt-3 mb-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              {/* Profile Picture */}
              <div className="relative w-14 h-14 flex-shrink-0">
                {userData.profileImage ? (
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
                    <Image
                      src={userData.profileImage}
                      alt="profile"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-2 border-purple-200 shadow-sm">
                    <User className="w-7 h-7 text-purple-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="text-base font-bold text-gray-900">{userData.fullName}</h3>
                  {userData.isVerified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                </div>
                <div className="text-sm text-gray-600 mb-0.5">@{userData.username}</div>

                {/* Compact badges */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {age && (
                    <span className="flex items-center justify-center bg-pink-100 text-pink-700 px-2 h-4 rounded-full text-xs font-medium">
                      {age}yr
                    </span>
                  )}
                  {(userData.height > 0 || userData.weight > 0) && (
                    <span className="flex items-center justify-center bg-blue-100 text-blue-700 px-2 h-4 rounded-full text-xs font-medium">
                      {userData.height > 0 ? userData.height + 'cm' : ''}
                      {userData.height > 0 && userData.weight > 0 && '/'}
                      {userData.weight > 0 ? userData.weight + 'kg' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Status Row */}
            <div className="text-center">
              {(userData.bornPlace || userData.livePlace) && (
                <div className="text-xs text-gray-600 mb-0.5 line-clamp-1">
                  {userData.bornPlace && userData.livePlace
                    ? `${userData.bornPlace} → ${userData.livePlace}`
                    : userData.bornPlace || userData.livePlace}
                </div>
              )}
              <div className="flex justify-center gap-2 text-xs text-gray-600">
                {userData.gender && (
                  <span className="flex items-center gap-1">
                    {userData.gender.toLowerCase() === 'male' ? (
                      <Mars className="w-1 h-1 text-gray-600" />
                    ) : (
                      <Venus className="w-1 h-1 text-gray-600" />
                    )}
                    {userData.gender}
                  </span>
                )}
                {userData.maritalStatus && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-1 h-1 text-gray-600" />
                    {userData.maritalStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compact Grid - 2 columns for better spacing */}
          <div className="grid grid-cols-2 gap-2">
            {/* Birth Date */}
            {userData.birthDate && (
              <div
                className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-sm border border-purple-200 p-2 ${
                  !(userData.education.university || userData.job.position) ? 'col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Calendar className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Birth Date</h4>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">
                  {dayjs(userData.birthDate).format('MMM DD, YYYY')}
                </p>
              </div>
            )}

            {/* Education */}
            {userData.education.university && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <GraduationCap className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Education</h4>
                </div>
                <div className="text-xs text-gray-700 line-clamp-2 leading-5 overflow-hidden">
                  {userData.education.topic || userData.education.university}
                </div>
              </div>
            )}

            {/* Job */}
            {userData.job.position && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Briefcase className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Career</h4>
                </div>
                <div className="text-xs text-gray-700 line-clamp-2 leading-5 overflow-hidden">
                  {userData.job.position}
                </div>
              </div>
            )}

            {/* Interests */}
            {displayInterests.length > 0 && (
              <div
                className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-sm border border-purple-200 p-2 ${
                  !(userData.favoriteSport.length > 0 || displaySkills.length > 0)
                    ? 'col-span-2'
                    : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Interests</h4>
                </div>
                <div className="flex flex-wrap gap-0.5 leading-5">
                  {displayInterests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 border border-purple-300 text-purple-700 rounded-full text-xs whitespace-nowrap leading-5"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sports */}
            {userData.favoriteSport.length > 0 && (
              <div
                className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-sm border border-purple-200 p-2 ${
                  !(displayInterests.length > 0 || displaySkills.length > 0) ? 'col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Dumbbell className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Sports</h4>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {userData.favoriteSport.slice(0, 3).map((sport, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 border border-purple-300 text-purple-700 rounded-full text-xs leading-5"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {displaySkills.length > 0 && (
              <div
                className={`bg-white rounded-lg shadow-sm border border-gray-100 p-2 ${
                  !(displayInterests.length > 0 || userData.favoriteSport.length > 0)
                    ? 'col-span-2'
                    : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Skills</h4>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {displaySkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 border border-blue-300 text-blue-700 rounded-full text-xs leading-5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Travel */}
            {userData.travelStyle && userData.travelStyle.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <MapPin className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Travel Style</h4>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {userData.travelStyle.slice(0, 2).map((style, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 border border-purple-300 text-purple-700 rounded-full text-xs leading-5"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visited Countries */}
            {userData.visitedCountries && userData.visitedCountries.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Globe className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Countries</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {userData.visitedCountries.slice(0, 5).map((country, index) => {
                    // Get country flag emoji (basic mapping for common countries)
                    const getCountryFlag = (countryName: string) => {
                      const flagMap: { [key: string]: string } = {
                        ایران: '🇮🇷',
                        iran: '🇮🇷',
                        ترکیه: '🇹🇷',
                        turkey: '🇹🇷',
                        دبی: '🇦🇪',
                        dubai: '🇦🇪',
                        امارات: '🇦🇪',
                        uae: '🇦🇪',
                        مالزی: '🇲🇾',
                        malaysia: '🇲🇾',
                        تایلند: '🇹🇭',
                        thailand: '🇹🇭',
                        سنگاپور: '🇸🇬',
                        singapore: '🇸🇬',
                        ژاپن: '🇯🇵',
                        japan: '🇯🇵',
                        کره: '🇰🇷',
                        korea: '🇰🇷',
                        چین: '🇨🇳',
                        china: '🇨🇳',
                        هند: '🇮🇳',
                        india: '🇮🇳',
                        روسیه: '🇷🇺',
                        russia: '🇷🇺',
                        آلمان: '🇩🇪',
                        germany: '🇩🇪',
                        فرانسه: '🇫🇷',
                        france: '🇫🇷',
                        ایتالیا: '🇮🇹',
                        italy: '🇮🇹',
                        اسپانیا: '🇪🇸',
                        spain: '🇪🇸',
                        انگلستان: '🇬🇧',
                        uk: '🇬🇧',
                        کانادا: '🇨🇦',
                        canada: '🇨🇦',
                        آمریکا: '🇺🇸',
                        usa: '🇺🇸',
                        استرالیا: '🇦🇺',
                        australia: '🇦🇺',
                      }
                      return flagMap[countryName.toLowerCase()] || '🏳️'
                    }
                    return (
                      <span key={index} className="text-sm">
                        {getCountryFlag(country)}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pet */}
            {(userData.pet.name || userData.pet.breed) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 col-span-4">
                <div className="flex items-center gap-1 mb-1">
                  <PawPrint className="w-1 h-1 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Pet</h4>
                </div>
                <div className="text-xs text-gray-700 line-clamp-2 leading-5 overflow-hidden">
                  {userData.pet.name || userData.pet.breed}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 text-center pt-3">
            <div className="text-sm font-bold text-gray-500 shadow" style={{ color: '#1e2939' }}>
              LongBio.me
            </div>
          </div>
        </div>
      </div>

      {/* Modal UI */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-[24rem] max-h-[170vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-1 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Share Bio Screenshot</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[calc(170vh)] overflow-y-auto">
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
                <div className="flex justify-center">
                  <div
                    className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    style={{ width: '360px', maxWidth: '360px' }}
                  >
                    <Image src={screenshot} alt="Bio Screenshot" width={360} height={600} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadScreenshot}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  >
                    <Download className="size-4" />
                  </button>
                  <button
                    onClick={shareScreenshot}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
