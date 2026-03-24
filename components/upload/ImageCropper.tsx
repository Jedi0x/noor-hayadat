'use client'

import React, { useState, useRef } from 'react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Check, X, Crop as CropIcon } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

/** Default crop: same shape as the image (96% × 96%), centered */
function buildDefaultCrop(mediaWidth: number, mediaHeight: number): Crop {
  return centerCrop(
    {
      unit: '%',
      width: 96,
      height: 96,
    },
    mediaWidth,
    mediaHeight
  )
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget
    const { width, height } = el
    const initial = buildDefaultCrop(width, height)
    setCrop(initial)
    setCompletedCrop(convertToPixelCrop(initial, width, height))
  }

  async function handleCrop() {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement('canvas')
      const image = imgRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      const sx = Math.round(completedCrop.x * scaleX)
      const sy = Math.round(completedCrop.y * scaleY)
      const sw = Math.round(completedCrop.width * scaleX)
      const sh = Math.round(completedCrop.height * scaleY)

      canvas.width = sw
      canvas.height = sh

      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob)
          }
        },
        'image/jpeg',
        0.92
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/90 backdrop-blur-md">
      <div className="bg-sand-50 rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-sage-300/30">
        {/* Header */}
        <div className="px-8 py-6 border-b-2 border-sage-200/40 flex items-center justify-between bg-gradient-to-b from-white to-sand-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bronze-100 rounded-xl">
              <CropIcon className="w-5 h-5 text-bronze-600" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-sage-900">Crop image</h2>
          </div>
          <p className="hidden sm:block text-xs text-sage-600 max-w-md text-right font-medium">
            Drag corners to focus on text. Default selection fits your photo.
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 hover:bg-sage-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-sage-700" strokeWidth={2.5} />
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-sage-100/30 min-h-[300px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
            className="max-h-full shadow-soft-lg"
            ruleOfThirds
            minWidth={40}
            minHeight={40}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Crop preview"
              src={imageSrc}
              onLoad={onImageLoad}
              className="max-w-full max-h-[min(65vh,600px)] w-auto h-auto object-contain block mx-auto rounded-2xl"
            />
          </ReactCrop>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 border-t-2 border-sage-200/40 flex flex-wrap justify-center gap-4 bg-gradient-to-t from-white to-sand-50/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3.5 bg-white text-sage-700 font-semibold border-2 border-sage-200 rounded-full hover:bg-sage-50 hover:border-sage-300 transition-all shadow-soft text-sm uppercase tracking-wide"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            disabled={!completedCrop?.width || !completedCrop?.height}
            className="group px-10 py-3.5 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-bold rounded-full hover:from-bronze-600 hover:to-bronze-700 shadow-soft-lg hover:shadow-2xl flex items-center disabled:opacity-40 disabled:pointer-events-none transition-all text-sm uppercase tracking-wide"
          >
            <Check className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Apply crop
          </button>
        </div>
      </div>
    </div>
  )
}
