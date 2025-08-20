'use client'
import { z } from 'zod'
import React from 'react'
import Image from 'next/image'
import { Suspense } from 'react'
import { PawPrint } from 'lucide-react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import type { Area } from 'react-easy-crop'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { useUpdateUser } from '@/service/user/hook'
import { setCookie, getCookie } from '@/utils/cookie'
import LabeledInput from '../components/LabeledInput'
import { zodResolver } from '@hookform/resolvers/zod'
import CropperDialog from '../components/CropperDialog'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '../components/SelectableOption'

const petSchema = z.object({
  hasPet: z.boolean({ required_error: 'Selection is required.' }),
  petName: z.string().optional(),
  petBreed: z.string().optional(),
})
type PetFormType = z.infer<typeof petSchema>

function PetContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormType>({
    resolver: zodResolver(petSchema),
    mode: 'onChange',
    defaultValues: (() => {
      if (typeof window !== 'undefined') {
        const cookie = getCookie('info_pet')
        if (cookie) {
          try {
            return JSON.parse(decodeURIComponent(cookie))
          } catch {}
        }
      }
      return { hasPet: undefined }
    })(),
  })
  const hasPet = watch('hasPet')
  const petName = watch('petName')
  const petBreed = watch('petBreed')

  // State for image cropping
  const [image, setImage] = React.useState<string | null>(null)
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [openCropper, setOpenCropper] = React.useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null)

  React.useEffect(() => {
    setCookie('info_pet', JSON.stringify({ hasPet, petName, petBreed, petImage: croppedImage }))
  }, [hasPet, petName, petBreed, croppedImage])

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setOpenCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle crop complete
  const onCropComplete = React.useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  // Utility to get cropped image
  async function getCroppedImg(imageSrc: string, crop: Area) {
    const createImage = (url: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image()
        img.addEventListener('load', () => resolve(img))
        img.addEventListener('error', (error) => reject(error))
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
      })
    }
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
    return canvas.toDataURL('image/jpeg')
  }

  // Handle confirm crop
  const handleConfirmCrop = React.useCallback(async () => {
    if (image && croppedAreaPixels) {
      const cropped = await getCroppedImg(image, croppedAreaPixels)
      setCroppedImage(cropped)
      setOpenCropper(false)
    }
  }, [image, croppedAreaPixels])

  const onSubmit = () => {
    try {
      mutation.mutate({
        pet: {
          hasPet: hasPet || false,
          type: petName || '',
          breed: petBreed || '',
        },
      })
    } catch (err) {
      console.error('Failed to update pet info', err)
    }

    router.push(`/info/sport?name=${name}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={64.32} className="shrink-0" />
      <Header className="mt-4" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s talk about your pets.
            </span>
          </div>
          <div className="flex flex-col space-y-6 w-full mt-20">
            <span className="text-xl font-bold">Do you have pet?</span>
            <SelectableOption
              id="hasPetYes"
              label="Yes I have it!"
              checked={hasPet === true}
              onCheckedChange={() => setValue('hasPet', true, { shouldValidate: true })}
              className="mb-2"
            />
            <SelectableOption
              id="hasPetNo"
              label="No I don't."
              checked={hasPet === false}
              onCheckedChange={() => setValue('hasPet', false, { shouldValidate: true })}
            />
          </div>
          {hasPet && (
            <div className="flex flex-col space-y-6 w-full my-24">
              <label className="text-xl font-bold" htmlFor="petName">
                Create Your Pet’s Identity — Name & Avatar
              </label>
              <div className="flex items-center justify-between flex-row-reverse gap-x-2.5">
                <label
                  htmlFor="pet-photo-upload"
                  className="size-14 shrink-0 rounded-full flex items-center justify-center bg-gray-100 border overflow-hidden cursor-pointer"
                >
                  {croppedImage ? (
                    <Image
                      src={croppedImage}
                      alt="Cropped Pet"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <PawPrint size={15} className="text-purple-400" />
                  )}
                  <CropperDialog
                    open={openCropper}
                    onOpenChange={setOpenCropper}
                    image={image}
                    onCropComplete={onCropComplete}
                    onConfirm={handleConfirmCrop}
                    crop={crop}
                    setCrop={setCrop}
                    zoom={zoom}
                    setZoom={setZoom}
                  />
                </label>
                <input
                  id="pet-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <LabeledInput
                  id="petName"
                  placeholder="Exp: Woody"
                  type="text"
                  error={!!errors.petName}
                  {...register('petName')}
                  className="flex items-center w-full"
                />
              </div>
              <h3 className="text-xl font-bold">What is the breed of your pet?</h3>
              <LabeledInput
                placeholder="Exp: German Shepherd"
                type="text"
                error={!!errors.petBreed}
                {...register('petBreed')}
              />
            </div>
          )}
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => router.push(`/info/sport?name=${name}`)}
        />
      </form>
    </div>
  )
}
export default function Pet() {
  return (
    <Suspense>
      <PetContent />
    </Suspense>
  )
}
