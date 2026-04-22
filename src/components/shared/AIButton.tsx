import React, { useState } from 'react'
import { ExternalLink, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { streamResponse } from '../../lib/api'

interface AIButtonProps {
  label: string
  prompt: string
  system?: string
}

export function AIButton({ label, prompt, system }: AIButtonProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    if (content) {
      setExpanded((e) => !e)
      return
    }
    setLoading(true)
    setExpanded(true)
    setContent('')
    setError('')
    try {
      await streamResponse(
        prompt,
        (text) => setContent((c) => c + text),
        () => setLoading(false),
        system
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-rtf-orange text-rtf-orange text-xs font-body font-medium hover:bg-[#FF762C18] transition-colors disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : content ? (
          expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ExternalLink size={12} />
        )}
        {label}
      </button>

      {expanded && (
        <div className="mt-2 p-4 bg-rtf-offwhite rounded-lg border border-rtf-border text-sm font-body text-gray-700 whitespace-pre-wrap leading-relaxed">
          {error ? (
            <span className="text-rtf-red">{error}</span>
          ) : (
            <>
              {content}
              {loading && <span className="inline-block w-0.5 h-4 bg-rtf-orange animate-pulse ml-0.5" />}
            </>
          )}
        </div>
      )}
    </div>
  )
}
