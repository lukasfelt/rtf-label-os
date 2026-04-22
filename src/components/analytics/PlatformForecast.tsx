import React from 'react'
import type { AIAnalysis } from '../../types'
import { getScoreColor } from '../../lib/scoring'

interface PlatformForecastProps {
  analysis: AIAnalysis
}

const PLATFORMS = [
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'spotify', label: 'Spotify', icon: '🟢' },
  { key: 'apple', label: 'Apple Music', icon: '🎧' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
] as const

export function PlatformForecast({ analysis }: PlatformForecastProps) {
  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Platform Forecast</h3>
      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map(({ key, label, icon }) => {
          const score = analysis.platformScores[key]
          const color = getScoreColor(score)
          return (
            <div key={key} className="p-3 bg-rtf-offwhite rounded-lg border border-rtf-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-body text-rtf-gray">{label}</span>
              </div>
              <div className="font-display text-3xl" style={{ color }}>
                {score}
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-rtf-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
