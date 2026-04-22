import React from 'react'
import type { AIAnalysis, Demo } from '../../types'
import { AIButton } from '../shared/AIButton'

interface AIInsightPanelProps {
  analysis: AIAnalysis
  demo: Demo
}

const FIX_COLORS = {
  good: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
  warn: { bg: '#fef3c7', text: '#BA7517', border: '#fde68a' },
  bad: { bg: '#fee2e2', text: '#E24B4A', border: '#fecaca' },
}

const VERDICT_COLORS = {
  hot: '#FF762C',
  solid: '#16a34a',
  weak: '#E24B4A',
}

export function AIInsightPanel({ analysis, demo }: AIInsightPanelProps) {
  const verdictColor = VERDICT_COLORS[analysis.verdict]

  const campaignPrompt = `Write a full viral campaign brief for ${demo.artist} - ${demo.song}.
Genre: ${demo.genre}. Viral score: ${analysis.viralScore}/100. Hook score: ${analysis.hookScore}/100.
Market fit: ${analysis.marketFitScore}/100. A&R notes: ${demo.notes}.
Format it as a professional campaign brief with: Campaign Concept, Target Platform Strategy,
TikTok Hook Approach, Content Calendar (2 weeks), Influencer Tier Recommendations,
Budget Allocation, and KPIs.`

  const signingPrompt = `Give a detailed signing recommendation for ${demo.artist} - ${demo.song}.
Scores: viral ${analysis.viralScore}, market fit ${analysis.marketFitScore}, hook ${analysis.hookScore}, mix ${analysis.mixScore}.
Genre: ${demo.genre}. Source: ${demo.source}.
Include: Go/No-Go decision, deal type recommendation (license vs full deal),
suggested term length, revenue split, advance range, marketing commitment clause,
sync rights recommendation, and territory.`

  const tiktokPrompt = `Create a TikTok viral strategy for ${demo.artist} - ${demo.song} (${demo.genre}, ${demo.bpm || '?'} BPM).
Provide: 5 specific content hook ideas (with exact 15-second clip timestamps if possible),
3 trending sound/challenge angles to attach to, creator tier targeting strategy,
optimal posting times, hashtag clusters, and a 7-day launch sequence.`

  const fixPrompt = `Give a detailed production fix list for ${demo.artist} - ${demo.song}.
Current scores: mix ${analysis.mixScore}, arrangement ${analysis.arrangementScore}, hook ${analysis.hookScore},
timbre ${analysis.timbreScore}, energy ${analysis.energyScore}, structure ${analysis.structureScore}.
List specific, actionable fixes the producer should make to increase viral score.
Group by: Mix & Master fixes, Arrangement fixes, Hook engineering, Timbre/Sound design.`

  return (
    <div className="bg-white rounded-xl border border-rtf-border p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display text-sm uppercase tracking-wide text-rtf-black">AI A&R Intelligence</h3>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-bold px-2 py-1 rounded"
            style={{ backgroundColor: verdictColor, color: 'white' }}
          >
            {analysis.verdict.toUpperCase()} — {analysis.verdictLabel}
          </span>
          <span className="text-xs font-body text-rtf-gray">
            {analysis.signingRecommendation === 'sign' ? '✅ Sign' : analysis.signingRecommendation === 'develop' ? '⚠️ Develop' : '❌ Pass'}
          </span>
        </div>
      </div>

      {/* Insight */}
      <div
        className="text-sm font-body text-rtf-black leading-relaxed mb-4 pb-4 border-b border-rtf-border"
        dangerouslySetInnerHTML={{ __html: analysis.insight }}
      />

      {/* Production Flags */}
      <div className="mb-4">
        <div className="text-xs font-body font-semibold uppercase tracking-widest text-rtf-gray mb-2">Production Flags</div>
        <div className="flex flex-wrap gap-2">
          {analysis.fixes.map((fix, i) => {
            const colors = FIX_COLORS[fix.type]
            return (
              <span
                key={i}
                className="text-xs font-body px-2.5 py-1 rounded-full border"
                style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
              >
                {fix.type === 'good' ? '✓' : fix.type === 'warn' ? '⚠' : '✗'} {fix.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* Deal Notes */}
      {analysis.dealNotes && (
        <div className="mb-4 p-3 bg-rtf-offwhite rounded-lg border border-rtf-border">
          <div className="text-xs font-body font-semibold uppercase tracking-widest text-rtf-gray mb-1">Deal Notes</div>
          <div className="text-sm font-body text-rtf-black">{analysis.dealNotes}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-rtf-border">
        <AIButton label="Generate Campaign Brief ↗" prompt={campaignPrompt} />
        <AIButton label="Signing Decision ↗" prompt={signingPrompt} />
        <AIButton label="TikTok Strategy ↗" prompt={tiktokPrompt} />
        <AIButton label="Production Fix List ↗" prompt={fixPrompt} />
      </div>
    </div>
  )
}
