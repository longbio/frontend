import Cropper from 'react-easy-crop'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import React from 'react'

type CropperDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  image: string | null
  // eslint-disable-next-line
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  onConfirm: () => void
  crop: { x: number; y: number }
  setCrop: (crop: { x: number; y: number }) => void
  zoom: number
  setZoom: (zoom: number) => void
}

const CropperDialog: React.FC<CropperDialogProps> = ({
  open,
  onOpenChange,
  image,
  onCropComplete,
  onConfirm,
  crop,
  setCrop,
  zoom,
  setZoom,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-64 md:max-w-[98vw] md:w-80">
        <DialogHeader>
          <DialogTitle>Crop your profile photo</DialogTitle>
        </DialogHeader>
        {image && (
          <div className="relative w-52 h-52 md:w-full md:h-72 bg-gray-100">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              minZoom={1}
              maxZoom={3}
              restrictPosition={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
              cropShape="round"
              objectFit="cover"
              style={{ mediaStyle: { width: '100%', height: '100%' } }}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-xs">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs">
            <span>1x</span>
            <span>3x</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-purple-blaze hover:bg-purple-blaze/90 transition text-white rounded-lg py-2"
            onClick={onConfirm}
            type="button"
          >
            Confirm
          </button>
          <DialogClose asChild>
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-200/70 transition rounded-lg py-2"
              type="button"
            >
              Cancel
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CropperDialog
