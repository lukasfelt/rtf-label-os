import React, { useEffect, useRef, useState } from 'react'
import { getScoreColor } from '../../lib/scoring'

interface ScoreBarProps {
  score: number
  max?: number
  label?: string
  showValue?: boolean
  height?: number
}

export function ScoreBar({ score, max = 100, label, showValue = true, height = 6 }: ScoreBarProps) {
  const [width, setWidth] = useState(0)
  const pct = Math.round((score / max) * 100)
  const color = getScoreColor(pct)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 50)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-body text-rtf-gray">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-medium" style={{ color }}>
              {score}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full bg-rtf-border overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
