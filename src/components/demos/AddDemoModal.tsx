import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useDemosStore } from '../../store/demosStore'
import type { Demo } from '../../types'

interface AddDemoModalProps {
  onClose: () => void
}

const SOURCES: Demo['source'][] = ['TikTok', 'Instagram', 'Email', 'Beatport', 'Spotify', 'SoundCloud', 'Internal', 'Other']
const STATUSES: { value: Demo['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'review', label: 'In Review' },
  { value: 'hold', label: 'On Hold' },
  { value: 'sign', label: 'Sign' },
  { value: 'pass', label: 'Pass' },
  { value: 'ref', label: 'Reference' },
]

export function AddDemoModal({ onClose }: AddDemoModalProps) {
  const { addDemo } = useDemosStore()
  const [form, setForm] = useState({
    artist: '',
    song: '',
    genre: '',
    bpm: '',
    key: '',
    source: 'TikTok' as Demo['source'],
    viralScore: '7',
    status: 'new' as Demo['status'],
    notes: '',
    tags: '',
    duration: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDemo({
      artist: form.artist,
      song: form.song,
      genre: form.genre,
      bpm: form.bpm ? parseInt(form.bpm) : undefined,
      key: form.key || undefined,
      source: form.source,
      viralScore: parseInt(form.viralScore),
      status: form.status,
      notes: form.notes,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      dateAdded: new Date().toISOString().split('T')[0],
      duration: form.duration || undefined,
    })
    onClose()
  }

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="px-6 py-4 border-b border-rtf-border flex items-center justify-between">
          <h2 className="font-display text-rtf-black uppercase tracking-wide">Add Demo</h2>
          <button onClick={onClose} className="text-rtf-gray hover:text-rtf-black">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Artist *</label>
              <input
                required
                value={form.artist}
                onChange={(e) => update('artist', e.target.value)}
                className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Song *</label>
              <input
                required
                value={form.song}
                onChange={(e) => update('song', e.target.value)}
                className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Genre</label>
              <input
                value={form.genre}
                onChange={(e) => update('genre', e.target.value)}
                className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">BPM</label>
              <input
                type="number"
                value={form.bpm}
                onChange={(e) => update('bpm', e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Key</label>
              <input
                value={form.key}
                onChange={(e) => update('key', e.target.value)}
                placeholder="e.g. A min"
                className="w-full px-3 py-2 text-sm font-mono border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Source</label>
              <select
                value={form.source}
                onChange={(e) => update('source', e.target.value)}
                className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Viral Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.viralScore}
                onChange={(e) => update('viralScore', e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="hook, festival, crossover"
              className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange"
            />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">A&R Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium border border-rtf-border text-rtf-gray hover:bg-rtf-offwhite transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF762C' }}
            >
              Add Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
