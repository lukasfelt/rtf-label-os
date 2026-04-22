import React, { useState } from 'react'
import { Plus, Search, BarChart2 } from 'lucide-react'
import { useDemosStore } from '../../store/demosStore'
import { Topbar } from '../layout/Topbar'
import { Badge } from '../shared/Badge'
import { ScoreBar } from '../shared/ScoreBar'
import { AvatarInitials } from '../shared/AvatarInitials'
import { DemoDetailPanel } from './DemoDetailPanel'
import { AddDemoModal } from './AddDemoModal'
import type { Demo } from '../../types'
import { getViralScoreColor } from '../../lib/scoring'

const FILTERS: { key: Demo['status'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'review', label: 'In Review' },
  { key: 'hold', label: 'On Hold' },
  { key: 'sign', label: 'Sign' },
  { key: 'pass', label: 'Pass' },
  { key: 'ref', label: 'Reference' },
]

const SOURCE_DOT_COLORS: Record<string, string> = {
  TikTok: '#000000',
  Instagram: '#E1306C',
  Email: '#888780',
  Beatport: '#00FF00',
  Spotify: '#1DB954',
  SoundCloud: '#FF5500',
  Internal: '#FF762C',
  Other: '#888780',
}

export function DemoInbox() {
  const { demos, selectedDemoId, selectDemo } = useDemosStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Demo['status'] | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = demos.filter((d) => {
    const matchSearch =
      !search ||
      d.artist.toLowerCase().includes(search.toLowerCase()) ||
      d.song.toLowerCase().includes(search.toLowerCase()) ||
      d.genre.toLowerCase().includes(search.toLowerCase()) ||
      d.source.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.status === filter
    return matchSearch && matchFilter
  })

  const stats = {
    total: demos.length,
    inReview: demos.filter((d) => d.status === 'review').length,
    readyToSign: demos.filter((d) => d.status === 'sign').length,
    avgScore: demos.length
      ? Math.round(demos.reduce((a, d) => a + d.viralScore, 0) / demos.length * 10) / 10
      : 0,
  }

  const selectedDemo = demos.find((d) => d.id === selectedDemoId) || null

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedDemo ? 'mr-[380px]' : ''}`}>
        <Topbar
          title="Demo Inbox"
          subtitle="A&R intake — all incoming tracks"
          actions={
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-body font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF762C' }}
            >
              <Plus size={14} />
              Add Demo
            </button>
          }
        />

        {/* Stats */}
        <div className="px-6 py-4 grid grid-cols-4 gap-4 border-b border-rtf-border bg-rtf-offwhite">
          {[
            { label: 'Total Demos', value: stats.total },
            { label: 'In Review', value: stats.inReview },
            { label: 'Ready to Sign', value: stats.readyToSign },
            { label: 'Avg Viral Score', value: stats.avgScore },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-rtf-border p-3">
              <div className="font-display text-2xl text-rtf-black">{s.value}</div>
              <div className="text-xs font-body text-rtf-gray mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="px-6 py-3 flex flex-col sm:flex-row gap-3 border-b border-rtf-border">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rtf-gray" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artist, song, genre..."
              className="w-full pl-8 pr-3 py-2 text-sm font-body border border-rtf-border rounded-lg bg-white focus:outline-none focus:border-rtf-orange"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded text-xs font-body font-medium transition-colors ${
                  filter === f.key
                    ? 'text-white'
                    : 'bg-white border border-rtf-border text-rtf-gray hover:border-rtf-orange hover:text-rtf-orange'
                }`}
                style={filter === f.key ? { backgroundColor: '#FF762C', border: '1px solid #FF762C' } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-rtf-offwhite border-b border-rtf-border">
              <tr>
                {['Artist / Song', 'Genre', 'Source', 'Viral Score', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-body font-semibold uppercase tracking-widest text-rtf-gray px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((demo) => (
                <tr
                  key={demo.id}
                  onClick={() => selectDemo(demo.id === selectedDemoId ? null : demo.id)}
                  className={`border-b border-rtf-border cursor-pointer transition-colors group ${
                    demo.id === selectedDemoId
                      ? 'bg-[#FF762C08]'
                      : 'hover:bg-rtf-offwhite'
                  } ${demo.viralScore >= 9 ? 'border-l-2' : ''}`}
                  style={demo.viralScore >= 9 ? { borderLeftColor: '#FF762C' } : undefined}
                >
                  {/* Artist / Song */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <AvatarInitials name={demo.artist} size="sm" />
                      <div>
                        <div className="text-sm font-body font-medium text-rtf-black">{demo.artist}</div>
                        <div className="text-xs font-body text-rtf-gray">{demo.song}</div>
                      </div>
                    </div>
                  </td>

                  {/* Genre */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-body text-rtf-gray">{demo.genre}</span>
                    {demo.bpm && (
                      <span className="ml-2 text-[10px] font-mono text-rtf-gray">{demo.bpm} BPM</span>
                    )}
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: SOURCE_DOT_COLORS[demo.source] || '#888780' }}
                      />
                      <span className="text-xs font-body text-rtf-gray">{demo.source}</span>
                    </div>
                  </td>

                  {/* Viral Score */}
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-mono font-bold w-5"
                        style={{ color: getViralScoreColor(demo.viralScore) }}
                      >
                        {demo.viralScore}
                      </span>
                      <div className="flex-1">
                        <ScoreBar score={demo.viralScore * 10} showValue={false} height={4} />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge status={demo.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {demo.aiAnalysis && (
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded" style={{ backgroundColor: '#FF762C', color: 'white' }}>
                          AI
                        </span>
                      )}
                      <BarChart2 size={14} className="text-rtf-gray hover:text-rtf-orange cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="text-rtf-gray font-body text-sm">No demos found</div>
                    <div className="text-rtf-border font-body text-xs mt-1">Try adjusting your search or filters</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedDemo && (
        <DemoDetailPanel demo={selectedDemo} onClose={() => selectDemo(null)} />
      )}

      {showAdd && <AddDemoModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
