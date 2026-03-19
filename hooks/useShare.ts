import { useState } from 'react'

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)

  const share = async (data: ShareData) => {
    if (!navigator.share) {
      // Fallback: Copy to clipboard?
      return false
    }

    setIsSharing(true)
    try {
      await navigator.share(data)
      return true
    } catch (e) {
      console.error('Share failed:', e)
      return false
    } finally {
      setIsSharing(false)
    }
  }

  const downloadAsImage = async (elementRef: React.RefObject<HTMLElement>, filename: string) => {
    if (!elementRef.current) return
    
    setIsSharing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(elementRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#FFFDF6'
      })
      
      const link = document.createElement('a')
      link.download = `${filename}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Download failed:', e)
    } finally {
      setIsSharing(false)
    }
  }

  return { share, downloadAsImage, isSharing }
}
