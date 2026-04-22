import React from 'react'
import { ScoreBar } from '../shared/ScoreBar'
import type { AIAnalysis } from '../../types'

interface DimensionBreakdownProps {
  analysis: AIAnalysis
}

const DIMENSIONS = [
  { key: 'viralScore', label: 'Viral Score' },
  { key: 'hookScore', label: 'Hook Score' },
  { key: 'marketFitScore', label: 'Market Fit' },
  { key: 'energyScore', label: 'Energy' },
  { key: 'mixScore', label: 'Mix / Master' },
  { key: 'arrangementScore', label: 'Arrangement' },
  { key: 'structureScore', label: 'Structure' },
  { key: 'timbreScore', label: 'Timbre' },
] as const

export function DimensionBreakdown({ analysis }: DimensionBreakdownProps) {
  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Dimension Breakdown</h3>
      <div className="space-y-3">
        {DIMENSIONS.map(({ key, label }) => (
          <ScoreBar
            key={key}
            score={analysis[key]}
            label={label}
            height={6}
          />
        ))}
      </div>
    </div>
  )
}
