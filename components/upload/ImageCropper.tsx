'use client'

import React, { useState, useRef } from 'react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Check, X } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

/** Default crop: same shape as the image (96% × 96%), centered — not a forced square. */
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
    // So "Apply crop" works without dragging first (pixel crop matches current on-screen size)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-cream-100 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-emerald-950/10 flex items-center justify-between bg-cream-100">
          <h2 className="text-xl font-bold text-emerald-950 px-2">Crop image</h2>
          <p className="hidden sm:block text-xs text-emerald-900/50 max-w-md text-right mr-2">
            Selection matches your photo shape. Drag corners to tighten around the text.
          </p>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-emerald-950/5 rounded-full shrink-0" aria-label="Close">
            <X className="w-6 h-6 text-emerald-950" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-emerald-950/5 min-h-[200px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
            className="max-h-full"
            ruleOfThirds
            minWidth={24}
            minHeight={24}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Crop preview"
              src={imageSrc}
              onLoad={onImageLoad}
              className="max-w-full max-h-[min(60vh,520px)] w-auto h-auto object-contain block mx-auto"
            />
          </ReactCrop>
        </div>

        <div className="p-6 border-t border-emerald-950/10 flex flex-wrap justify-center gap-3 sm:gap-4 bg-cream-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-transparent text-emerald-950 font-bold border border-emerald-950/20 rounded-full hover:bg-emerald-950/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            disabled={!completedCrop?.width || !completedCrop?.height}
            className="px-8 py-3 bg-emerald-950 text-cream-50 font-bold rounded-full hover:bg-emerald-900 shadow-lg flex items-center disabled:opacity-50 disabled:pointer-events-none"
          >
            <Check className="w-5 h-5 mr-2" />
            Apply crop
          </button>
        </div>
      </div>
    </div>
  )
}
