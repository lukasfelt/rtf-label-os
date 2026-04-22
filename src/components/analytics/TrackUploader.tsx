import React, { useState, useRef } from 'react'
import { Upload, Music } from 'lucide-react'
import { useDemosStore } from '../../store/demosStore'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { AvatarInitials } from '../shared/AvatarInitials'

export function TrackUploader() {
  const { demos } = useDemosStore()
  const { currentDemoId, setCurrentDemo } = useAnalyticsStore()
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In v1, we just pick the first available demo or show a placeholder
      if (demos.length > 0 && !currentDemoId) {
        setCurrentDemo(demos[0].id)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragging ? 'border-rtf-orange bg-[#FF762C08]' : 'border-rtf-border hover:border-rtf-orange'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false) }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".mp3,.wav,.aiff,.aif"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload size={24} className="mx-auto mb-3 text-rtf-gray" />
        <div className="text-sm font-body font-medium text-rtf-black">Drop a track or select from your pipeline</div>
        <div className="text-xs font-body text-rtf-gray mt-1">MP3, WAV, AIFF — v1 reads metadata only</div>
      </div>

      {/* Pipeline quick-select */}
      <div>
        <div className="text-xs font-body font-semibold uppercase tracking-widest text-rtf-gray mb-3">
          Quick Select from Pipeline
        </div>
        <div className="flex flex-wrap gap-2">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setCurrentDemo(demo.id === currentDemoId ? null : demo.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-body transition-all ${
                currentDemoId === demo.id
                  ? 'text-white border-rtf-orange'
                  : 'bg-white text-rtf-gray border-rtf-border hover:border-rtf-orange hover:text-rtf-orange'
              }`}
              style={currentDemoId === demo.id ? { backgroundColor: '#FF762C' } : undefined}
            >
              <AvatarInitials name={demo.artist} size="sm" className="w-5 h-5 text-[9px]" />
              <span>{demo.artist} — {demo.song}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
