'use client'
import { z } from 'zod'
import React from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import type { Area } from 'react-easy-crop'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie, getCookie } from '@/utils/cookie'
import { Info, Plus, Trash, User } from 'lucide-react'
import CropperDialog from '../components/CropperDialog'
import { useUploadProfileImage } from '@/service/user/hook'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useRef, useState, useEffect } from 'react'
import getCroppedImg, { dataURLtoFile } from '@/app/info/components/cropImage'

function SetProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const isEditMode = searchParams.get('edit') === 'true'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)
  const mutation = useUploadProfileImage()

  const SetProfileSchema = z.object({
    profile: z
      .any()
      .refine(
        (file) => {
          // Allow null, undefined, or empty
          if (!file || file === null || file === undefined) return true
          return true
        },
        {
          message: 'Please select a valid photo.',
        }
      )
      .optional()
      .nullable(),
  })
  type SetProfileFormType = z.infer<typeof SetProfileSchema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {},
  } = useForm<SetProfileFormType>({
    resolver: zodResolver(SetProfileSchema),
    mode: 'onChange',
  })
  const file = watch('profile')

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfileClick = () => {
    if (file) setShowDelete((prev) => !prev)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue('profile', null as unknown as File)
    setShowDelete(false)
  }

  const onSubmit = async () => {
    if (!file) {
      if (isEditMode) {
        return router.push('/bio')
      } else {
        return router.push(`/info/travel?name=${name}`)
      }
    }

    try {
      const response = await mutation.mutateAsync(file)
      setCookie('info_set_profile', JSON.stringify({ preview: response.data.url }))

      // If in edit mode, return to bio page, otherwise continue to next step
      if (isEditMode) {
        router.push('/bio')
      } else {
        router.push(`/info/travel?name=${name}`)
      }
    } catch (err) {
      console.error('Failed to upload profile image', err)
      // Don't navigate on error
    }
  }
  // For preview
  const [preview, setPreview] = useState<string | null>(null)

  // Load cookie values on client side only
  useEffect(() => {
    const cookie = getCookie('info_set_profile')
    if (cookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookie))
        if (parsed.preview) {
          setPreview(parsed.preview)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    setCookie('info_set_profile', JSON.stringify({ preview }))
  }, [preview])

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const handleCropSave = async () => {
    if (selectedImage && croppedAreaPixels) {
      const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels)
      setPreview(croppedImg)
      setShowCropper(false)
      setValue('profile', dataURLtoFile(croppedImg, 'profile.jpg'), { shouldValidate: true })
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={35.7} />
      <Header className="mt-4" showBackButton />
      <CropperDialog
        open={showCropper}
        onOpenChange={setShowCropper}
        image={selectedImage}
        onCropComplete={onCropComplete}
        onConfirm={handleCropSave}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
      />
      <form className="flex flex-col justify-between h-full mt-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal">
              We love that you&apos;re here. pick your profile photo.
            </span>
          </div>
          <div className="flex flex-col items-center mt-12">
            <div className="relative flex flex-col">
              <div
                className="w-44 h-44 rounded-full bg-cloud-mist flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={handleProfileClick}
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile"
                    fill
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <User className="w-20 h-20 text-gray-400" />
                )}
                {showDelete && preview && (
                  <Trash
                    className="absolute size-8 z-10 bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow px-2 py-1 text-xs text-red-600 cursor-pointer hover:bg-red-50 transition-all"
                    onClick={handleDelete}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={handleAddClick}
                className="absolute bottom-2 right-2 bg-purple-blaze text-white rounded-full p-2 border-2 border-white hover:bg-purple-700 transition-colors"
                aria-label="Add profile photo"
              >
                <Plus className="size-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('profile', {
                  onChange: (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setSelectedImage(event.target?.result as string)
                        setShowCropper(true)
                      }
                      reader.readAsDataURL(file)
                    }
                  },
                })}
                ref={(el) => {
                  fileInputRef.current = el
                }}
              />
            </div>
            <span className="text-base text-black font-light mt-4">{name}</span>
            <div className="flex w-full items-center gap-1 text-xs mt-10">
              <Info className="size-4" />
              <span>You can always update this later</span>
            </div>
          </div>
        </div>
        <StickyNav
          onNext={(e) => {
            // Prevent default form submission since form already has onSubmit handler
            e.preventDefault()
            // Call handleSubmit which will validate and call onSubmit if valid
            handleSubmit(onSubmit)(e)
          }}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/travel?name=${name}`)
            }
          }}
          loading={mutation.isPending}
        />
      </form>
    </div>
  )
}

export default function SetProfile() {
  return (
    <Suspense>
      <SetProfileContent />
    </Suspense>
  )
}
