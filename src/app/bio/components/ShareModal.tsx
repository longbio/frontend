'use client'

import { useState } from 'react'
import { X, Copy, Share2, Check } from 'lucide-react'
import {
  TelegramShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'next-share'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    id: number
    fullName: string
    username: string
  }
}

export default function ShareModal({ isOpen, onClose, userData }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://longbio.me/bio/${userData.username}`
  const shareTitle = `${userData.fullName}'s Bio`
  const shareText = `Check out ${userData.fullName}'s bio on LongBio!`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share Bio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              <Share2 className="w-6 h-6" />
              <span className="font-medium">Share via Device</span>
            </button>
          )}

          {/* Social Media Buttons */}
          <div className="flex justify-center gap-3">
            <TelegramShareButton
              url={shareUrl}
              title={shareTitle}
              className="flex flex-col items-center gap-2 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            <WhatsappShareButton
              url={shareUrl}
              title={shareTitle}
              separator=":: "
              className="flex flex-col items-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <LinkedinShareButton
              url={shareUrl}
              title={shareTitle}
              className="flex flex-col items-center gap-2 p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-colors"
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>

          {/* Copy Link */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              <span className="sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Share {userData.fullName}&apos;s bio with your friends!
          </p>
        </div>
      </div>
    </div>
  )
}
