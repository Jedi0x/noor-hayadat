import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  id: number
  label_en: string
  label_detail: string
}

const STEPS: Step[] = [
  { id: 1, label_en: 'Preparing image', label_detail: 'Optimizing quality' },
  { id: 2, label_en: 'Extracting text', label_detail: 'Reading Arabic script' },
  { id: 3, label_en: 'Matching database', label_detail: 'Finding references' },
  { id: 4, label_en: 'Building result', label_detail: 'Preparing display' }
]

export const ProgressSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="w-full space-y-4">
      {STEPS.map((step) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.id * 0.1 }}
            className={`flex items-center justify-between p-5 rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 ${
              isActive
                ? 'bg-white border-bronze-400 shadow-soft-lg scale-[1.02]'
                : isCompleted
                  ? 'bg-sage-50/50 border-sage-300/30 opacity-70'
                  : 'bg-white/30 border-sage-200/20 opacity-40'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-500 ${
                  isActive
                    ? 'border-bronze-500 bg-bronze-500 text-white shadow-[0_0_20px_rgba(168,130,79,0.3)]'
                    : isCompleted
                      ? 'border-sage-500 bg-sage-500 text-white'
                      : 'border-sage-300 bg-white text-sage-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>

              {/* Labels */}
              <div className="flex flex-col">
                <span
                  className={`text-base font-bold transition-colors ${
                    isActive ? 'text-sage-900' : 'text-sage-700'
                  }`}
                >
                  {step.label_en}
                </span>
                <span className="text-xs font-medium text-sage-500 uppercase tracking-wide">
                  {step.label_detail}
                </span>
              </div>
            </div>

            {/* Active Animation */}
            {isActive && (
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 bg-bronze-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-bronze-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-bronze-500 rounded-full"
                />
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
