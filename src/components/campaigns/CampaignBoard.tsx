import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { usePipelineStore } from '../../store/pipelineStore'
import { Topbar } from '../layout/Topbar'
import type { Campaign } from '../../types'

const COLUMNS: { id: Campaign['status']; label: string; color: string }[] = [
  { id: 'idea', label: 'Idea', color: '#888780' },
  { id: 'brief', label: 'Brief', color: '#3B82F6' },
  { id: 'production', label: 'In Production', color: '#BA7517' },
  { id: 'live', label: 'Live', color: '#16a34a' },
  { id: 'completed', label: 'Completed', color: '#7C3AED' },
]

const TYPE_COLORS: Record<Campaign['type'], string> = {
  TikTok: '#000000',
  'Meta Ads': '#1877F2',
  Organic: '#16a34a',
  Influencer: '#7C3AED',
  'Full Launch': '#FF762C',
}

export function CampaignBoard() {
  const { campaigns, addCampaign, updateCampaign } = usePipelineStore()
  const [showAdd, setShowAdd] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    if (draggingId) updateCampaign(draggingId, { status: colId as Campaign['status'] })
    setDraggingId(null)
    setOverColumn(null)
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Campaigns"
        subtitle="Campaign pipeline management"
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-body font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF762C' }}
          >
            <Plus size={14} /> New Campaign
          </button>
        }
      />

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full">
          {COLUMNS.map((col) => {
            const colItems = campaigns.filter((c) => c.status === col.id)
            const isOver = overColumn === col.id
            return (
              <div
                key={col.id}
                className={`flex flex-col w-[260px] rounded-xl bg-rtf-offwhite border transition-colors ${
                  isOver ? 'border-rtf-orange' : 'border-rtf-border'
                }`}
                onDragOver={(e) => { e.preventDefault(); setOverColumn(col.id) }}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={() => setOverColumn(null)}
              >
                <div className="px-3 pt-3 pb-2 border-b-2" style={{ borderBottomColor: col.color }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body font-semibold uppercase tracking-wide text-rtf-black">{col.label}</span>
                    <span className="text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: col.color }}>
                      {colItems.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colItems.map((campaign) => (
                    <div
                      key={campaign.id}
                      draggable
                      onDragStart={() => setDraggingId(campaign.id)}
                      onDragEnd={() => { setDraggingId(null); setOverColumn(null) }}
                      className={`bg-white rounded-lg border border-rtf-border p-3 cursor-grab active:cursor-grabbing ${draggingId === campaign.id ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="text-sm font-body font-medium text-rtf-black leading-tight">{campaign.name}</div>
                        <span
                          className="text-[10px] font-body px-1.5 py-0.5 rounded flex-shrink-0 text-white"
                          style={{ backgroundColor: TYPE_COLORS[campaign.type] }}
                        >
                          {campaign.type}
                        </span>
                      </div>
                      <div className="text-xs font-body text-rtf-gray mb-2">{campaign.artist}</div>
                      {campaign.budget && (
                        <div className="text-xs font-mono text-rtf-orange">${campaign.budget.toLocaleString()}</div>
                      )}
                      {campaign.dueDate && (
                        <div className="text-[10px] font-body text-rtf-gray mt-1">{campaign.dueDate}</div>
                      )}
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="flex items-center justify-center h-16 text-xs font-body text-rtf-gray">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showAdd && <AddCampaignModal onClose={() => setShowAdd(false)} onAdd={addCampaign} />}
    </div>
  )
}

function AddCampaignModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Omit<Campaign, 'id'>) => void }) {
  const [form, setForm] = useState({
    name: '', artist: '', type: 'TikTok' as Campaign['type'], status: 'idea' as Campaign['status'],
    budget: '', notes: '', dueDate: '',
  })

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ ...form, budget: form.budget ? parseInt(form.budget) : undefined, targetPlatform: [form.type] })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-4 border-b border-rtf-border flex items-center justify-between">
          <h2 className="font-display text-rtf-black uppercase tracking-wide">New Campaign</h2>
          <button onClick={onClose}><X size={18} className="text-rtf-gray" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Campaign Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Artist</label>
              <input value={form.artist} onChange={(e) => update('artist', e.target.value)} className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange" />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange">
                {['TikTok', 'Meta Ads', 'Organic', 'Influencer', 'Full Launch'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Budget ($)</label>
              <input type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} className="w-full px-3 py-2 text-sm font-mono border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange" />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange" />
            </div>
          </div>
          <div>
            <label className="text-xs font-body font-medium text-rtf-black uppercase tracking-wide block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} className="w-full px-3 py-2 text-sm font-body border border-rtf-border rounded-lg focus:outline-none focus:border-rtf-orange resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-body border border-rtf-border text-rtf-gray hover:bg-rtf-offwhite">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium text-white hover:opacity-90" style={{ backgroundColor: '#FF762C' }}>Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}
