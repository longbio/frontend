import Image from 'next/image'
import { useRef, useState } from 'react'

interface ImageUploaderProps {
  className?: string
  image?: string | null
  setImage?: (img: string | null) => void
  isProfile?: boolean
}

export default function ImageUploader({
  className,
  image: imageProp,
  setImage: setImageProp,
  isProfile = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalImage, setInternalImage] = useState<string | null>(null)
  const image = imageProp !== undefined ? imageProp : internalImage
  const setImage = setImageProp !== undefined ? setImageProp : setInternalImage

  const handleDivClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const displayImage =
    image || (isProfile ? '/assets/images/logo.png' : '/assets/images/cover-image.png')

  return (
    <div
      className={`relative w-full ${className || ''} ${isProfile ? 'group' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={handleDivClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Image
        src={displayImage}
        alt="Uploaded"
        fill
        className={`object-cover ${isProfile ? 'rounded-full' : 'rounded-b-[50px]'}`}
      />
      {isProfile && (
        <button
          type="button"
          className="absolute right-2 bottom-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation()
            handleDivClick()
          }}
        ></button>
      )}
    </div>
  )
}
