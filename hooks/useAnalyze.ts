import { useState } from 'react'
import { AnalyzeResponse } from '@/types'

export type ScanStep = 1 | 2 | 3 | 4 // 1: Reading, 2: Identifying, 3: Resolving, 4: Done

export function useAnalyze() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [currentStep, setCurrentStep] = useState<ScanStep>(1)

  const analyze = async (imageFile: File) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setCurrentStep(1)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      // Simulate step 1 duration
      await new Promise(r => setTimeout(r, 800))
      setCurrentStep(2)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      // Simulate step 2 duration
      await new Promise(r => setTimeout(r, 1200))
      setCurrentStep(3)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      
      // Simulate step 3 duration
      await new Promise(r => setTimeout(r, 1000))
      setCurrentStep(4)
      
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setIsAnalyzing(false)
    setCurrentStep(1)
  }

  return { analyze, isAnalyzing, error, result, reset, currentStep }
}
