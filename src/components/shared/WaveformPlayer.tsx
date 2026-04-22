import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Play, Pause } from 'lucide-react'

interface WaveformPlayerProps {
  duration?: string
}

export function WaveformPlayer({ duration = '0:30' }: WaveformPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const bars = useMemo(() => {
    return Array.from({ length: 40 }, () => 15 + Math.random() * 70)
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false)
            return 0
          }
          return p + 0.5
        })
      }, 50)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  const filledCount = Math.floor((progress / 100) * bars.length)

  return (
    <div className="flex items-center gap-3 p-3 bg-rtf-offwhite rounded-lg">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
        style={{ backgroundColor: '#FF762C' }}
      >
        {playing ? (
          <Pause size={14} fill="white" stroke="white" />
        ) : (
          <Play size={14} fill="white" stroke="white" />
        )}
      </button>

      <div className="flex items-end gap-[2px] flex-1 h-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-colors duration-100"
            style={{
              height: `${h}%`,
              backgroundColor: i < filledCount ? '#FF762C' : '#E8E7E3',
            }}
          />
        ))}
      </div>

      <span className="text-xs font-mono text-rtf-gray flex-shrink-0">
        {duration}
      </span>
    </div>
  )
}
