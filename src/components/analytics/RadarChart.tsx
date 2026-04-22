import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import type { AIAnalysis } from '../../types'

Chart.register(...registerables)

interface RadarChartProps {
  analysis: AIAnalysis
}

export function RadarChart({ analysis }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()

    chartInstance.current = new Chart(chartRef.current, {
      type: 'radar',
      data: {
        labels: ['Viral', 'Hook', 'Market Fit', 'Energy', 'Mix', 'Arrangement'],
        datasets: [{
          label: 'Track Score',
          data: [
            analysis.viralScore,
            analysis.hookScore,
            analysis.marketFitScore,
            analysis.energyScore,
            analysis.mixScore,
            analysis.arrangementScore,
          ],
          backgroundColor: 'rgba(255, 118, 44, 0.15)',
          borderColor: '#FF762C',
          borderWidth: 2,
          pointBackgroundColor: '#FF762C',
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 25,
              font: { family: 'JetBrains Mono', size: 9 },
              color: '#888780',
            },
            pointLabels: {
              font: { family: 'Inter', size: 11 },
              color: '#181818',
            },
            grid: { color: '#E8E7E3' },
            angleLines: { color: '#E8E7E3' },
          },
        },
      },
    })

    return () => chartInstance.current?.destroy()
  }, [analysis])

  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Score Radar</h3>
      <div style={{ height: 240 }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}
