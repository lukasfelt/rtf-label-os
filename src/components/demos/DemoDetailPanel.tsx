import React, { useState } from 'react'
import { X, Music, Tag, ExternalLink } from 'lucide-react'
import { useDemosStore } from '../../store/demosStore'
import { AvatarInitials } from '../shared/AvatarInitials'
import { Badge } from '../shared/Badge'
import { ScoreBar } from '../shared/ScoreBar'
import { WaveformPlayer } from '../shared/WaveformPlayer'
import { AIButton } from '../shared/AIButton'
import type { Demo } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useAnalyticsStore } from '../../store/analyticsStore'

const STATUS_OPTIONS: { value: Demo['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'review', label: 'In Review' },
  { value: 'hold', label: 'On Hold' },
  { value: 'sign', label: 'Sign' },
  { value: 'pass', label: 'Pass' },
  { value: 'ref', label: 'Reference' },
]

interface DemoDetailPanelProps {
  demo: Demo
  onClose: () => void
}

export function DemoDetailPanel({ demo, onClose }: DemoDetailPanelProps) {
  const { updateDemo, updateStatus } = useDemosStore()
  const { setCurrentDemo } = useAnalyticsStore()
  const [notes, setNotes] = useState(demo.notes)
  const navigate = useNavigate()

  const handleNotesBlur = () => {
    updateDemo(demo.id, { notes })
  }

  const handleStatusChange = (status: Demo['status']) => {
    updateStatus(demo.id, status)
  }

  const handleAnalyze = () => {
    setCurrentDemo(demo.id)
    navigate('/analytics')
    onClose()
  }

  const campaignBriefPrompt = `Write a full viral campaign brief for ${demo.artist} - ${demo.song}.
Genre: ${demo.genre}. Viral score: ${demo.viralScore * 10}/100. A&R notes: ${demo.notes}.
Format it as a professional campaign brief with: Campaign Concept, Target Platform Strategy,
TikTok Hook Approach, Content Calendar (2 weeks), Influencer Tier Recommendations,
Budget Allocation, and KPIs.`

  const compTracksPrompt = `Find 5 comp tracks and market references for ${demo.artist} - ${demo.song} (${demo.genre}, ${demo.bpm || '?'} BPM).
List tracks that are: sonically similar, trending in 2024-2025, and used as TikTok templates.
Include artist, song, why it's a comp, and what to learn from it.`

  const tiktokPrompt = `Create a TikTok viral strategy for ${demo.artist} - ${demo.song} (${demo.genre}, ${demo.bpm || '?'} BPM).
Provide: 5 specific content hook ideas (with exact 15-second clip timestamps if possible),
3 trending sound/challenge angles to attach to, creator tier targeting strategy,
optimal posting times, hashtag clusters, and a 7-day launch sequence.`

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-white border-l border-rtf-border z-20 flex flex-col shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-rtf-border flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AvatarInitials name={demo.artist} size="lg" />
          <div>
            <div className="font-body font-semibold text-rtf-black">{demo.artist}</div>
            <div className="text-sm font-body text-rtf-gray">{demo.song}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-rtf-gray hover:text-rtf-black transition-colors mt-0.5">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-body bg-rtf-offwhite text-rtf-gray px-2 py-1 rounded">{demo.genre}</span>
          {demo.bpm && (
            <span className="text-xs font-mono bg-rtf-offwhite text-rtf-gray px-2 py-1 rounded">{demo.bpm} BPM</span>
          )}
          {demo.key && (
            <span className="text-xs font-mono bg-rtf-offwhite text-rtf-gray px-2 py-1 rounded">{demo.key}</span>
          )}
          {demo.duration && (
            <span className="text-xs font-mono bg-rtf-offwhite text-rtf-gray px-2 py-1 rounded">{demo.duration}</span>
          )}
        </div>

        {/* Waveform */}
        <WaveformPlayer duration={demo.duration} />

        {/* Viral Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide">Viral Score</span>
            <span className="text-lg font-mono font-bold text-rtf-orange">{demo.viralScore}/10</span>
          </div>
          <ScoreBar score={demo.viralScore * 10} showValue={false} height={8} />
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-2">Status</label>
          <select
            value={demo.status}
            onChange={(e) => handleStatusChange(e.target.value as Demo['status'])}
            className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg bg-white focus:outline-none focus:border-rtf-orange"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        {demo.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Tag size={12} className="text-rtf-gray" />
              <span className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {demo.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-body px-2 py-0.5 rounded-full bg-rtf-offwhite text-rtf-gray border border-rtf-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-2">A&R Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            rows={4}
            className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg bg-white focus:outline-none focus:border-rtf-orange resize-none"
            placeholder="Add notes..."
          />
        </div>

        {/* AI Analysis Summary */}
        {demo.aiAnalysis && (
          <div className="p-3 rounded-lg border border-rtf-border bg-rtf-offwhite">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide">AI Analysis</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#FF762C', color: 'white' }}
              >
                {demo.aiAnalysis.verdict.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { label: 'Viral', value: demo.aiAnalysis.viralScore },
                { label: 'Hook', value: demo.aiAnalysis.hookScore },
                { label: 'Mix', value: demo.aiAnalysis.mixScore },
                { label: 'Market', value: demo.aiAnalysis.marketFitScore },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs font-body">
                  <span className="text-rtf-gray">{s.label}</span>
                  <span className="font-mono font-medium text-rtf-black">{s.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              className="text-xs font-body text-rtf-orange hover:underline flex items-center gap-1"
            >
              View full analysis <ExternalLink size={10} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div>
          <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-2">AI Actions</label>
          <div className="space-y-2">
            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-body font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF762C' }}
            >
              <Music size={14} />
              Run AI Analysis
            </button>
            <AIButton label="Campaign Brief ↗" prompt={campaignBriefPrompt} />
            <AIButton label="Comp Tracks ↗" prompt={compTracksPrompt} />
            <AIButton label="TikTok Strategy ↗" prompt={tiktokPrompt} />
          </div>
        </div>
      </div>
    </div>
  )
}
