import Image from 'next/image'
import { useRef, useState } from 'react'

interface ImageUploaderProps {
  className?: string
}

export default function ImageUploader({ className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)

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

  return (
    <div className={`w-full ${className || ''}`} onClick={handleDivClick}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {image && <Image src={image} alt="Uploaded" fill className="object-cover rounded-b-[50px]" />}
    </div>
  )
}
