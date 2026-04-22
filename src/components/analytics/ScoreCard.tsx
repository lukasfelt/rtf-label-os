import React from 'react'
import { getScoreColor } from '../../lib/scoring'

interface ScoreCardProps {
  label: string
  score: number
  verdict?: string
  verdictColor?: string
  size?: 'hero' | 'normal'
}

export function ScoreCard({ label, score, verdict, verdictColor, size = 'normal' }: ScoreCardProps) {
  const color = getScoreColor(score)
  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <div className="text-xs font-body font-semibold uppercase tracking-widest text-rtf-gray mb-2">{label}</div>
      <div
        className={`font-display ${size === 'hero' ? 'text-5xl' : 'text-4xl'}`}
        style={{ color }}
      >
        {score}
      </div>
      <div className="text-xs font-body text-rtf-gray mt-1">/ 100</div>
      {verdict && (
        <span
          className="inline-block mt-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded"
          style={{ backgroundColor: verdictColor || color, color: 'white' }}
        >
          {verdict}
        </span>
      )}
    </div>
  )
}
