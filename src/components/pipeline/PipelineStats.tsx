import React from 'react'
import type { Demo } from '../../types'

interface PipelineStatsProps {
  demos: Demo[]
}

export function PipelineStats({ demos }: PipelineStatsProps) {
  const total = demos.length
  const signed = demos.filter((d) => d.status === 'sign').length
  const conversionRate = total > 0 ? Math.round((signed / total) * 100) : 0
  const avgScore = total > 0 ? (demos.reduce((a, d) => a + d.viralScore, 0) / total).toFixed(1) : '0'
  const hotPicks = demos.filter((d) => d.viralScore >= 9).length
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const newThisWeek = demos.filter((d) => new Date(d.dateAdded) >= oneWeekAgo).length

  const stats = [
    { label: 'Total Pipeline', value: total },
    { label: 'Conversion Rate', value: `${conversionRate}%` },
    { label: 'Avg Viral Score', value: avgScore },
    { label: 'Hot Picks (9+)', value: hotPicks },
    { label: 'New This Week', value: newThisWeek },
  ]

  return (
    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-rtf-offwhite border-b border-rtf-border">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-lg border border-rtf-border p-3">
          <div className="font-display text-2xl text-rtf-black">{s.value}</div>
          <div className="text-xs font-body text-rtf-gray mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
