import React from 'react'
import { ConfidenceLevel } from '@/types'

const VALID_LEVELS: ConfidenceLevel[] = ['HIGH', 'MEDIUM', 'LOW']

export const ConfidenceBadge: React.FC<{ level?: ConfidenceLevel | null }> = ({ level }) => {
  const safe: ConfidenceLevel =
    level && VALID_LEVELS.includes(level) ? level : 'LOW'

  const colors: Record<ConfidenceLevel, string> = {
    HIGH: 'bg-green-500/10 text-green-600 border-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    LOW: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const labels: Record<ConfidenceLevel, string> = {
    HIGH: 'Verified',
    MEDIUM: 'Likely',
    LOW: 'Uncertain',
  }

  return (
    <div className={`px-3 py-1 rounded-full border text-xs font-bold ${colors[safe]}`}>
      {labels[safe]}
    </div>
  )
}
