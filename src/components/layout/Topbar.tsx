import React from 'react'
import { Bell, Search } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-rtf-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-display text-rtf-black uppercase tracking-wide text-xl">{title}</h1>
        {subtitle && <p className="text-xs font-body text-rtf-gray mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rtf-offwhite transition-colors text-rtf-gray">
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}
