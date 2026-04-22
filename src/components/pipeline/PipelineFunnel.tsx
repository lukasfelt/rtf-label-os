import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import type { Demo } from '../../types'
import { PIPELINE_COLUMNS } from '../../lib/constants'

Chart.register(...registerables)

interface PipelineFunnelProps {
  demos: Demo[]
}

export function PipelineFunnel({ demos }: PipelineFunnelProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const colCounts = PIPELINE_COLUMNS.map((col) => ({
    ...col,
    count: demos.filter((d) => d.status === col.id).length,
  }))

  const topScores = [...demos]
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, 5)

  const sourceCounts: Record<string, number> = {}
  demos.forEach((d) => {
    sourceCounts[d.source] = (sourceCounts[d.source] || 0) + 1
  })

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: colCounts.map((c) => c.label),
        datasets: [{
          data: colCounts.map((c) => c.count),
          backgroundColor: colCounts.map((c) => c.color + '90'),
          borderColor: colCounts.map((c) => c.color),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#E8E7E3' }, ticks: { font: { family: 'JetBrains Mono', size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 } } },
        },
      },
    })

    return () => chartInstance.current?.destroy()
  }, [demos])

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl border border-rtf-border p-5">
        <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Pipeline Funnel</h3>
        <div style={{ height: 240 }}>
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top Viral Scores */}
        <div className="bg-white rounded-xl border border-rtf-border p-5">
          <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Top Viral Scores</h3>
          <div className="space-y-3">
            {topScores.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-rtf-gray w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-body font-medium text-rtf-black truncate">{d.artist}</div>
                  <div className="text-[11px] font-body text-rtf-gray truncate">{d.song}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-rtf-border overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.viralScore * 10}%`, backgroundColor: '#FF762C' }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-rtf-orange">{d.viralScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-xl border border-rtf-border p-5">
          <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Source Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(sourceCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => (
                <div key={source} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-body text-rtf-black">{source}</span>
                      <span className="text-xs font-mono text-rtf-gray">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-rtf-border overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / demos.length) * 100}%`,
                          backgroundColor: '#FF762C',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
