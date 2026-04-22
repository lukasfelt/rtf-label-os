import React, { useState } from 'react'
import { useDemosStore } from '../../store/demosStore'
import { Topbar } from '../layout/Topbar'
import { PipelineStats } from './PipelineStats'
import { PipelineKanban } from './PipelineKanban'
import { PipelineFunnel } from './PipelineFunnel'

type View = 'board' | 'funnel'

export function PipelineBoard() {
  const { demos } = useDemosStore()
  const [view, setView] = useState<View>('board')

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Pipeline"
        subtitle="Demo pipeline management"
        actions={
          <div className="flex rounded-lg border border-rtf-border overflow-hidden">
            {(['board', 'funnel'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-body font-medium capitalize transition-colors ${
                  view === v
                    ? 'text-white'
                    : 'bg-white text-rtf-gray hover:bg-rtf-offwhite'
                }`}
                style={view === v ? { backgroundColor: '#FF762C' } : undefined}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      <PipelineStats demos={demos} />

      <div className="flex-1 overflow-hidden">
        {view === 'board' ? (
          <PipelineKanban />
        ) : (
          <div className="h-full overflow-y-auto">
            <PipelineFunnel demos={demos} />
          </div>
        )}
      </div>
    </div>
  )
}
