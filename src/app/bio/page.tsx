'use client'
import { Suspense } from 'react'
import ImageUploader from './components/ImageUploader'

function BioContent() {
  return (
    <div className="flex flex-col justify-start items-center h-full px-4 pb-4">
      <ImageUploader className="w-full object-cover bg-gray-200 rounded-b-[50px] cursor-pointer overflow-hidden" />
      <div className="absolute top-1/10 w-28 h-28 border border-white shadow-lg bg-amber-200 rounded-full">
        <ImageUploader />
      </div>
    </div>
  )
}

export default function Bio() {
  return (
    <Suspense>
      <BioContent />
    </Suspense>
  )
}
