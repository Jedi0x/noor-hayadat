import React from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

interface Step {
  id: number
  label_ur: string
  label_en: string
}

const STEPS: Step[] = [
  { id: 1, label_ur: 'Reading Image', label_en: 'Preparing your image' },
  { id: 2, label_ur: 'Identifying Arabic Text', label_en: 'Extracting Arabic script' },
  { id: 3, label_ur: 'Fetching References', label_en: 'Resolving references' }
]

export const ProgressSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="w-full space-y-4">
      {STEPS.map((step) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep

        return (
          <div 
            key={step.id}
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
              isActive 
                ? 'bg-white border-gold-500 shadow-xl scale-105 z-10' 
                : isCompleted 
                  ? 'bg-emerald-950/5 border-emerald-950/10 opacity-60' 
                  : 'bg-transparent border-emerald-950/5 opacity-30'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-500 ${
                isActive ? 'border-gold-500 bg-gold-500 text-emerald-950' : 
                isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                'border-emerald-950/10 text-emerald-950/20'
              }`}>
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-extrabold ${isActive ? 'text-emerald-950' : 'text-emerald-950/60'}`}>
                  {step.label_ur}
                </span>
                <span className="text-xs font-medium text-emerald-950/40 uppercase tracking-tighter">
                  {step.label_en}
                </span>
              </div>
            </div>
            
            {isActive && (
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-gold-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gold-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gold-500 rounded-full"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
