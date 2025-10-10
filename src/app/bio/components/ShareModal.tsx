'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Check } from 'lucide-react'
import {
  TelegramShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'next-share'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Bio</DialogTitle>
          <DialogDescription>
            Share {userData.fullName}&apos;s bio with your friends!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share via Device</span>
            </Button>
          )}

          {/* Social Media Buttons */}
          <div className="flex justify-center gap-3">
            <TelegramShareButton
              url={shareUrl}
              title={shareTitle}
              className="flex flex-col items-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <TelegramIcon size={24} round />
            </TelegramShareButton>

            <WhatsappShareButton
              url={shareUrl}
              title={shareTitle}
              separator=":: "
              className="flex flex-col items-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <WhatsappIcon size={24} round />
            </WhatsappShareButton>

            <LinkedinShareButton
              url={shareUrl}
              title={shareTitle}
              className="flex flex-col items-center gap-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <LinkedinIcon size={24} round />
            </LinkedinShareButton>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <Input type="text" value={shareUrl} readOnly className="flex-1 text-sm" />
            <Button
              onClick={handleCopyLink}
              variant={copied ? 'default' : 'outline'}
              className={`whitespace-nowrap ${
                copied ? 'bg-green-500 hover:bg-green-600 text-white' : ''
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
