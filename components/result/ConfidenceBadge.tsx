import React from 'react'
import { ConfidenceLevel } from '@/types'
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'

const VALID_LEVELS: ConfidenceLevel[] = ['HIGH', 'MEDIUM', 'LOW']

export const ConfidenceBadge: React.FC<{ level?: ConfidenceLevel | null }> = ({ level }) => {
  const safe: ConfidenceLevel = level && VALID_LEVELS.includes(level) ? level : 'LOW'

  const config: Record<
    ConfidenceLevel,
    { bg: string; text: string; border: string; label: string; Icon: any }
  > = {
    HIGH: {
      bg: 'bg-gradient-to-r from-sage-100 to-sage-50',
      text: 'text-sage-700',
      border: 'border-sage-300',
      label: 'Verified',
      Icon: CheckCircle2,
    },
    MEDIUM: {
      bg: 'bg-gradient-to-r from-bronze-100 to-sand-100',
      text: 'text-bronze-700',
      border: 'border-bronze-300',
      label: 'Likely match',
      Icon: AlertCircle,
    },
    LOW: {
      bg: 'bg-gradient-to-r from-sand-100 to-sand-50',
      text: 'text-sand-700',
      border: 'border-sand-300',
      label: 'Uncertain',
      Icon: HelpCircle,
    },
  }

  const { bg, text, border, label, Icon } = config[safe]

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 ${bg} ${text} ${border} text-xs font-bold uppercase tracking-wider shadow-soft`}
    >
      <Icon className="w-4 h-4" aria-hidden strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  )
}
