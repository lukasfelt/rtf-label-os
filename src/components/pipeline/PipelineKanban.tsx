import React, { useState } from 'react'
import { useDemosStore } from '../../store/demosStore'
import { AvatarInitials } from '../shared/AvatarInitials'
import { Badge } from '../shared/Badge'
import { DemoDetailPanel } from '../demos/DemoDetailPanel'
import type { Demo } from '../../types'
import { PIPELINE_COLUMNS } from '../../lib/constants'
import { getViralScoreColor } from '../../lib/scoring'

export function PipelineKanban() {
  const { demos, updateStatus, selectedDemoId, selectDemo } = useDemosStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<string | null>(null)

  const selectedDemo = demos.find((d) => d.id === selectedDemoId) || null

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setOverColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggingId) {
      updateStatus(draggingId, columnId as Demo['status'])
    }
    setDraggingId(null)
    setOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setOverColumn(null)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full">
          {PIPELINE_COLUMNS.map((col) => {
            const colDemos = demos.filter((d) => d.status === col.id)
            const isOver = overColumn === col.id
            return (
              <div
                key={col.id}
                className={`flex flex-col w-[240px] rounded-xl bg-rtf-offwhite border transition-colors ${
                  isOver ? 'border-rtf-orange bg-[#FF762C08]' : 'border-rtf-border'
                }`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div
                  className="px-3 pt-3 pb-2 border-b-2"
                  style={{ borderBottomColor: col.color }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body font-semibold uppercase tracking-wide text-rtf-black">
                      {col.label}
                    </span>
                    <span
                      className="text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: col.color }}
                    >
                      {colDemos.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colDemos.map((demo) => (
                    <DemoKanbanCard
                      key={demo.id}
                      demo={demo}
                      isDragging={draggingId === demo.id}
                      isSelected={selectedDemoId === demo.id}
                      onDragStart={(e) => handleDragStart(e, demo.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => selectDemo(demo.id === selectedDemoId ? null : demo.id)}
                    />
                  ))}
                  {colDemos.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs font-body text-rtf-gray">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDemo && (
        <DemoDetailPanel demo={selectedDemo} onClose={() => selectDemo(null)} />
      )}
    </div>
  )
}

interface DemoKanbanCardProps {
  demo: Demo
  isDragging: boolean
  isSelected: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onClick: () => void
}

function DemoKanbanCard({ demo, isDragging, isSelected, onDragStart, onDragEnd, onClick }: DemoKanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`bg-white rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm ${
        isDragging ? 'opacity-40 rotate-1' : ''
      } ${isSelected ? 'border-rtf-orange shadow-sm' : 'border-rtf-border'} ${
        demo.status === 'sign' ? 'border-l-2 border-l-rtf-green' : ''
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <AvatarInitials name={demo.artist} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-body font-medium text-rtf-black truncate">{demo.artist}</div>
          <div className="text-[11px] font-body text-rtf-gray truncate">{demo.song}</div>
        </div>
        <span
          className="text-[11px] font-mono font-bold flex-shrink-0"
          style={{ color: getViralScoreColor(demo.viralScore) }}
        >
          {demo.viralScore}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-body text-rtf-gray bg-rtf-offwhite px-1.5 py-0.5 rounded">
          {demo.genre}
        </span>
        <span className="text-[10px] font-body text-rtf-gray bg-rtf-offwhite px-1.5 py-0.5 rounded">
          {demo.source}
        </span>
        {demo.aiAnalysis && (
          <span className="text-[10px] font-mono px-1 py-0.5 rounded" style={{ backgroundColor: '#FF762C18', color: '#FF762C' }}>
            AI
          </span>
        )}
      </div>
    </div>
  )
}
