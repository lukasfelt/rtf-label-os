import React from 'react'
import type { AIAnalysis } from '../../types'

interface CompTracksProps {
  analysis: AIAnalysis
}

export function CompTracks({ analysis }: CompTracksProps) {
  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Market Comp Tracks</h3>
      <div className="space-y-3">
        {analysis.compTracks.map((track, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-rtf-offwhite rounded-lg">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-mono flex-shrink-0"
              style={{ backgroundColor: '#FF762C' }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-body font-medium text-rtf-black truncate">{track.song}</div>
              <div className="text-xs font-body text-rtf-gray">{track.artist}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-mono font-bold text-rtf-orange">{track.matchPct}</div>
              <div className="text-[10px] font-body text-rtf-gray">match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
