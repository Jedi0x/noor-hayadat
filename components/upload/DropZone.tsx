'use client'

import React, { useCallback, useState } from 'react'
import { Upload, Image as ImageIcon, X, Crop } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface DropZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onReset: () => void
  onCrop?: () => void
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, selectedFile, onReset, onCrop }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "relative border-3 border-dashed rounded-[3rem] p-20 transition-all duration-300 cursor-pointer group",
              "flex flex-col items-center justify-center space-y-7",
              isDragging
                ? "border-bronze-400 bg-bronze-50/60 scale-[1.02] shadow-soft-lg"
                : "border-sage-300/60 bg-white/50 hover:border-bronze-400/70 hover:bg-sand-50/60 hover:shadow-soft"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {/* Background texture */}
            <div className="absolute inset-0 rounded-[3rem] bg-paper-texture opacity-40"></div>

            {/* Background glow on hover/drag */}
            <div className={cn(
              "absolute inset-0 rounded-[3rem] bg-gradient-to-br transition-all duration-500",
              isDragging 
                ? "from-bronze-400/15 to-sand-400/15 opacity-100" 
                : "from-bronze-400/0 to-sand-400/0 group-hover:from-bronze-400/8 group-hover:to-sand-400/8 opacity-100"
            )}></div>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Upload Icon with glow */}
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl transition-all duration-300",
                isDragging ? "bg-bronze-400/40" : "bg-bronze-400/20 group-hover:bg-bronze-400/30"
              )}></div>
              <div className="relative bg-gradient-to-br from-sand-100 via-sand-200 to-bronze-100 p-7 rounded-3xl shadow-soft group-hover:shadow-soft-lg transition-all duration-300">
                <Upload className="w-12 h-12 text-bronze-600" strokeWidth={2} />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center relative z-10 space-y-4">
              <p className="text-3xl font-semibold text-sage-900">Upload screenshot</p>
              <p className="text-base text-sage-600 max-w-md mx-auto leading-relaxed">
                Drop an image of Quranic text, Hadith, or Dua here
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="w-8 h-px bg-sage-300"></div>
                <p className="text-xs text-sage-500 font-semibold uppercase tracking-wider">
                  PNG, JPG, WEBP · Max 10MB
                </p>
                <div className="w-8 h-px bg-sage-300"></div>
              </div>
            </div>

            {/* Button */}
            <button className="relative mt-2 px-10 py-3.5 bg-sage-900 text-sand-50 rounded-full text-sm font-semibold hover:bg-sage-800 transition-all duration-200 shadow-soft hover:shadow-soft-lg uppercase tracking-wide">
              Choose file
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/90 backdrop-blur-sm border-2 border-sage-200/50 rounded-[2.5rem] p-7 overflow-hidden shadow-soft-lg"
          >
            {/* Decorative corner dots */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-bronze-300/50"></div>
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-bronze-300/50"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-bronze-300/50"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-bronze-300/50"></div>

            {/* Image Preview */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-sand-50/60 flex items-center justify-center border-2 border-sage-200/30 shadow-inner-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Upload preview"
                className="max-w-full max-h-full object-contain"
              />

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReset()
                }}
                className="absolute top-4 right-4 p-3 bg-sage-900/95 text-white rounded-full hover:bg-sage-800 transition-all backdrop-blur-sm shadow-soft-lg group"
                aria-label="Remove image"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* File Info & Actions */}
            <div className="mt-7 flex items-center justify-between px-3">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-sage-100 rounded-xl shadow-soft">
                  <ImageIcon className="w-5 h-5 text-sage-600" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sage-900 truncate max-w-[220px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-sage-500 font-medium mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {onCrop && (
                  <button
                    onClick={onCrop}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bronze-700 bg-bronze-50 hover:bg-bronze-100 border-2 border-bronze-200 rounded-full transition-all shadow-soft hover:shadow-soft-lg"
                  >
                    <Crop className="w-4 h-4" strokeWidth={2.5} />
                    Crop
                  </button>
                )}
                <button
                  onClick={onReset}
                  className="px-5 py-2.5 text-sm font-semibold text-sage-600 hover:text-sage-900 hover:bg-sage-50 rounded-full transition-all"
                >
                  Change
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
