import React, { useState, useEffect } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { Topbar } from '../layout/Topbar'
import { TrackUploader } from './TrackUploader'
import { ScoreCard } from './ScoreCard'
import { DimensionBreakdown } from './DimensionBreakdown'
import { RadarChart } from './RadarChart'
import { CompTracks } from './CompTracks'
import { PlatformForecast } from './PlatformForecast'
import { AIInsightPanel } from './AIInsightPanel'
import { AvatarInitials } from '../shared/AvatarInitials'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { useDemosStore } from '../../store/demosStore'
import { analyzeTrack, buildAnalysisPrompt, ANALYSIS_SYSTEM } from '../../lib/api'
import type { AIAnalysis } from '../../types'

const ANALYSIS_STEPS = [
  'Scanning waveform & frequency spectrum...',
  'Analyzing mix balance & loudness (LUFS)...',
  'Detecting hook density & placement...',
  'Evaluating arrangement structure & arc...',
  'Profiling timbre & sonic palette...',
  'Comparing against 2024–25 market references...',
  'Calculating platform-specific virality scores...',
  'Generating AI insight report...',
]

export function ListeningAnalytics() {
  const { currentDemoId, currentAnalysis, isAnalyzing, analysisStep, setAnalysis, setAnalyzing, setStep } = useAnalyticsStore()
  const { demos, setAnalysis: saveToDemoStore } = useDemosStore()
  const [error, setError] = useState('')

  const currentDemo = demos.find((d) => d.id === currentDemoId) || null
  const existingAnalysis = currentDemo?.aiAnalysis || currentAnalysis

  const handleAnalyze = async () => {
    if (!currentDemo) return
    setAnalyzing(true)
    setAnalysis(null)
    setError('')

    // Step through analysis stages
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStep(i)
      await new Promise((r) => setTimeout(r, 500))
      if (i === 5) {
        // Fire the actual API call during steps 6-8
        try {
          const prompt = buildAnalysisPrompt(currentDemo)
          const content = await analyzeTrack(ANALYSIS_SYSTEM, prompt)
          // Clean the response (remove markdown fences if any)
          const cleaned = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim()
          const analysis: AIAnalysis = JSON.parse(cleaned)
          analysis.analyzedAt = new Date().toISOString()

          // Finish remaining steps
          for (let j = i + 1; j < ANALYSIS_STEPS.length; j++) {
            setStep(j)
            await new Promise((r) => setTimeout(r, 300))
          }

          setAnalysis(analysis)
          saveToDemoStore(currentDemo.id, analysis)
        } catch (e) {
          setError(
            'Failed to connect to RTF API server. Make sure the backend is running on port 3001.\n\nRun: node server/index.js'
          )
        }
        break
      }
    }
    setAnalyzing(false)
  }

  const VERDICT_COLORS = {
    hot: '#FF762C',
    solid: '#16a34a',
    weak: '#E24B4A',
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="AI Listening Analytics"
        subtitle="Viral intelligence powered by Claude AI"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Track Selector */}
          <div className="bg-white rounded-xl border border-rtf-border p-5">
            <h2 className="font-display text-sm uppercase tracking-wide text-rtf-black mb-4">Select Track</h2>
            <TrackUploader />

            {currentDemo && (
              <div className="mt-4 pt-4 border-t border-rtf-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AvatarInitials name={currentDemo.artist} size="md" />
                  <div>
                    <div className="text-sm font-body font-semibold text-rtf-black">
                      {currentDemo.artist} — {currentDemo.song}
                    </div>
                    <div className="text-xs font-body text-rtf-gray">
                      {currentDemo.genre} · {currentDemo.bpm ? `${currentDemo.bpm} BPM` : ''} · {currentDemo.key || ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-body font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#FF762C' }}
                >
                  {isAnalyzing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Zap size={16} />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Track'}
                </button>
              </div>
            )}

            {!currentDemo && (
              <div className="mt-4 flex justify-end">
                <button
                  disabled
                  className="px-5 py-2.5 rounded-lg text-sm font-body font-medium text-white opacity-40 cursor-not-allowed"
                  style={{ backgroundColor: '#FF762C' }}
                >
                  Analyze Track
                </button>
              </div>
            )}
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-white rounded-xl border border-rtf-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 size={18} className="animate-spin text-rtf-orange" />
                <span className="text-sm font-body font-medium text-rtf-black">Running AI Analysis...</span>
              </div>
              <div className="space-y-2">
                {ANALYSIS_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        i < analysisStep ? 'bg-rtf-green' : i === analysisStep ? 'bg-rtf-orange animate-pulse' : 'bg-rtf-border'
                      }`}
                    />
                    <span
                      className={`text-xs font-body ${
                        i <= analysisStep ? 'text-rtf-black' : 'text-rtf-gray'
                      }`}
                    >
                      Step {i + 1}: {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-rtf-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-rtf-orange transition-all duration-500"
                  style={{ width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="text-sm font-body text-rtf-red font-medium mb-1">Connection Error</div>
              <div className="text-xs font-mono text-red-600 whitespace-pre-wrap">{error}</div>
            </div>
          )}

          {/* Results */}
          {existingAnalysis && currentDemo && !isAnalyzing && (
            <>
              {/* Track Header */}
              <div className="bg-white rounded-xl border border-rtf-border p-5 flex items-center gap-4">
                <AvatarInitials name={currentDemo.artist} size="lg" />
                <div>
                  <div className="font-display text-lg uppercase tracking-wide text-rtf-black">
                    {currentDemo.artist} — {currentDemo.song}
                  </div>
                  <div className="text-sm font-body text-rtf-gray">
                    {currentDemo.genre}
                    {currentDemo.bpm ? ` · ${currentDemo.bpm} BPM` : ''}
                    {currentDemo.key ? ` · ${currentDemo.key}` : ''}
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-xs font-mono font-bold px-3 py-1 rounded"
                    style={{
                      backgroundColor: VERDICT_COLORS[existingAnalysis.verdict],
                      color: 'white',
                    }}
                  >
                    {existingAnalysis.verdictLabel}
                  </span>
                </div>
              </div>

              {/* Hero Score Cards */}
              <div className="grid grid-cols-4 gap-4">
                <ScoreCard
                  label="Viral Score"
                  score={existingAnalysis.viralScore}
                  verdict={existingAnalysis.verdict}
                  verdictColor={VERDICT_COLORS[existingAnalysis.verdict]}
                  size="hero"
                />
                <ScoreCard label="Mix Score" score={existingAnalysis.mixScore} />
                <ScoreCard label="Hook Score" score={existingAnalysis.hookScore} />
                <ScoreCard label="Market Fit" score={existingAnalysis.marketFitScore} />
              </div>

              {/* Dimension + Radar */}
              <div className="grid grid-cols-2 gap-4">
                <DimensionBreakdown analysis={existingAnalysis} />
                <RadarChart analysis={existingAnalysis} />
              </div>

              {/* Comps + Platform */}
              <div className="grid grid-cols-2 gap-4">
                <CompTracks analysis={existingAnalysis} />
                <PlatformForecast analysis={existingAnalysis} />
              </div>

              {/* AI Insight */}
              <AIInsightPanel analysis={existingAnalysis} demo={currentDemo} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
