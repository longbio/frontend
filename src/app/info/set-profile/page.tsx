'use client'
import Image from 'next/image'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Suspense, useRef, useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Info, Plus, Trash, User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function SetProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)

  const SetProfileSchema = z.object({
    profile: z.instanceof(File).refine((file) => file && file.type.startsWith('image/'), {
      message: 'لطفا یک عکس معتبر انتخاب کنید',
    }),
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

  const onSubmit = () => {
    router.push(`/info/travel?name=${name}`)
  }

  // For preview
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (file && file instanceof File) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={35.7} />
      <Header className="mt-4" />
      <form className="flex flex-col flex-grow mt-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold">
          Welcome to <br /> Long-Bio, {name}!
        </h1>
        <span className="text-sm font-normal">
          We love that you&apos;re here. pick your profile photo.
        </span>
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
                  setValue('profile', file, { shouldValidate: true })
                  if (file) {
                    handleSubmit(onSubmit)()
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
        <Button
          type="submit"
          className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
        >
          Next
        </Button>
      </form>
      <button
        type="button"
        className="w-full text-sm font-normal mt-2 rounded-4xl"
        onClick={() => router.push(`/info/travel?name=${name}`)}
      >
        skip
      </button>
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
