'use client'

import React, { useCallback, useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
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
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 ease-in-out cursor-pointer",
              "flex flex-col items-center justify-center space-y-4",
              isDragging 
                ? "border-gold-500 bg-gold-500/10" 
                : "border-emerald-950/20 bg-cream-100 hover:border-emerald-950/40"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="bg-emerald-950/5 p-4 rounded-full">
              <Upload className="w-8 h-8 text-emerald-950" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-emerald-950 text-center">Upload Screenshot</p>
              <p className="text-sm text-emerald-950/60 mt-1">PNG, JPG, WEBP (Max 10MB)</p>
            </div>
            <button className="mt-4 px-6 py-2 bg-emerald-950 text-cream-50 rounded-full font-medium hover:bg-emerald-900 transition-colors">
              Select File
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-cream-100 border border-emerald-950/10 rounded-2xl p-4 overflow-hidden shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-emerald-950/5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Upload preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-emerald-950/40" />
                <span className="text-sm font-medium text-emerald-950/60 truncate max-w-[150px]">
                  {selectedFile.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {onCrop && (
                  <button
                    onClick={onCrop}
                    className="text-sm font-bold text-emerald-950/60 hover:text-emerald-950 uppercase tracking-widest transition-colors"
                  >
                    Crop
                  </button>
                )}
                <button
                  onClick={onReset}
                  className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-widest transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
